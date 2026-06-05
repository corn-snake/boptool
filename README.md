built with vue & deno. install nodejs & deno first, then get into the folder via commandline & run `npm i`. when that's done go to the `serve` folder & run that again.
once that's done, go back & run `deno task sdev`, open another commandline window, and `deno task dev`. hopefully everything "works"

---

## external services
the deno server connects to a supabase instance and an r2 bucket to hold all of the state data; these can in theory be replaced with more consolidated interfaces to a local postgres server and file read/write calls should server resources not be concerns. further, an email service is configured elsewhere to provide user password self-reset functionality

### database
the structure of the database is divided into two schemata, `bop_bopdata` and `bop_userdata`.

#### `bop_userdata`
...has 2 tables:
- `ud` has seven columns: `uid` (of type uuid, non-nullable, primary), `uname` (text, non-nullable, unique), `uhash` (text, non-nullable), which ideally is a computed sha512 hash of `uname` and thus constricted to 128 characters of length (as all other hash-columns henceforth), `sfhash` (text, non-nullable), `forumpic` (text), `amdin` (boolean, non-nullable, default false), & `email` (text, unique)
- `logins` has `tknhash` (text, prim.), `uid` (uuid, non-nullable, fkey->bop_userdata.ud.uid), & `expires` (int8, non-nullable), this last one being a timestamp in JS format

#### `bop_bopdata`
there are three tables here:
- `bops` has `id` (int8, prim.), `name` (text, non-nullable), & `icon` (text, non-nullable)
- `turns` has `bid` (int8, prim., fkey->bop_bopdata.bops.id), `number` (int8, non-nullable, prim.), `host` (uuid, non-nullable, fkey->bop_userdata.ud.uid), `chosts` (uuid[], ideally each element fkey->bop_userdata.ud.uid), `players` (jsonb[], non-nullable, def. `[]`), `npcs` (text[]) & `processing` (boolean, non-nullable, def. `false`)
  - `players`, in practice, also has a particular structure: `uid` (uuid, ditto ideal fkey->bop_userdata.ud.uid) & `name` (text), though this is mainly a check of the database functions (see below) & the interface rather than a hard-coded thing
- `file_ts` has `file` (text, prim.) & `at` (int8, non-nullable)

additionally there can, and oftentimes should, exist a table `pwdRequests` (consisting of a single uuid, primary column `uid`, fkey->bop_userdata.ud.uid) to keep unfulfilled password requests, & in the case of public instances `accountRequests`, holding requests made by other users for the registration of new ones (with columns `by` \[uuid, primary, fkey->bop_userdata.ud.uid], & `requesting` \[jsonb[], non-nullable; inner structure `uname` {text, non-nullable, unique} & `email` {text, nullable, unique}])

#### functions
there are, at present, five database such that the server calls through RPC, in order to to offload some more expensive processing steps and reduce the number of network trips. these are:
```sql
CREATE OR REPLACE FUNCTION bop_bopdata."getUserBops"(uid uuid)
  RETURNS json
  set search_path = ''
  AS $$
    DECLARE
      hostsjn text;
      chostsjn text;
      playsjn text;
    BEGIN
      select into hostsjn concat('[', string_agg(concat('[', cast(bid as text), ',"', name, '","', icon, '",', cast(last as text), ']'), ','), ']') from (select bid, name, icon, max(number) as last from bop_bopdata.bops join bop_bopdata.turns on id=bid where bid in (select bid from bop_bopdata.turns where uid=host) group by bid, name, icon);

      select into chostsjn concat('[', string_agg(concat('[', cast(bid as text), ',"', name, '","', icon, '",', cast(last as text), ']'), ','), ']') from (select bid, name, icon, max(number) as last from bop_bopdata.bops join bop_bopdata.turns on id=bid where bid in (select bid from bop_bopdata.turns where uid=ANY(chosts)) group by bid, name, icon);

      select into playsjn to_jsonb(coalesce(array_agg(bd), ARRAY[]::json[])) from (select json_array(id, name, icon, 0, array_agg(json_object('name': tpname, 'number': tpnumber))) as bd from (
        select bops.id, bops.name, coalesce(bops.icon, '') as icon,
        turn_players.name as tpname, turn_players.turn as tpnumber,
        coalesce(case when bops.last_processing = true then nrturn else mturn end, -1) as max_turn
        from bop_bopdata.bops
        left join bop_bopdata.turn_players on id=bop
        left join (select max(number) as mturn, bid from bop_bopdata.turns group by bid) mt on mt.bid = id
        left join lateral (select max(number) as nrturn, bid from bop_bopdata.turns where number <> mturn group by bid) mp on mp.bid=id
        where player=ui)
      where tpnumber <= max_turn
      group by id, name, icon);

    RETURN concat('{"hosts": ', hostsjn, ', "chost": ', chostsjn, ', "plays": ', playsjn, '}');
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bop_bopdata."buildHistory"(uid uuid, bn int)
  RETURNS int[]
  set search_path = ''
  AS $$
    DECLARE
      bopinfo record;
      players uuid[];
      last_turn int;
    BEGIN
      select into bopinfo host, chosts, last_processing from bop_bopdata.bops where id=bn;
      select into players array_agg(player) from bop_bopdata.turn_players where bop=bn group by turn order by turn desc limit 1;
      IF bopinfo.host = uid or uid = ANY(bopinfo.chosts) THEN
        return (select array_agg(distinct turn order by turn asc) from bop_bopdata.turn_players where bop=bn);
      ELSIF uid=ANY(players) then
        IF bopinfo.last_processing = true THEN
          select into last_turn number from bop_bopdata.turns where bid=bn order by number desc limit 1;
          return (select array_agg(turn order by turn asc) from bop_bopdata.turn_players where bop=bn and player=uid and turn <> last_turn);
        END IF;
        return (select array_agg(turn order by turn asc) from bop_bopdata.turn_players where bop=bn and player=uid);
      END IF;
      return null;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bop_bopdata."isMod"(bn int8, uid uuid)
  RETURNS boolean
  set search_path = ''
  AS $$
    DECLARE
        turn RECORD;
    BEGIN
        select into turn host,chosts from bop_bopdata.turns where bid=bn order by number desc limit 1;
        IF NOT FOUND THEN
          RETURN false;
        ELSIF turn.host = uid or uid = ANY(turn.chosts) THEN
          RETURN true;
        END IF;
        RETURN false;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bop_bopdata."validateBopStanding"(bn int8, tn int8, uid uuid, claim int4)
    RETURNS text
    SET search_path = ''
    AS $$
    DECLARE
        turn RECORD;
        player_uid uuid[];
        max_turn int;
    BEGIN
        select into turn host,chosts,players from bop_bopdata.turns where bid=bn and number=tn limit 1;
        IF NOT FOUND THEN
          RETURN 'false';
        ELSIF claim = 2 and turn.host = uid THEN
          RETURN 'true';
        ELSIF claim = 1 and uid = ANY(turn.chosts) THEN
          RETURN cast(array_position(turn.chosts, uid) - 1 as text);
        END IF;
        select into player_uid array((select cast(unnest(players)->>'uid' as uuid) from bop_bopdata.turns where bid=bid and number=tn));
        select into max_turn max(number) from bop_bopdata.turns where bid=bn;
        IF (turn.last_processing = false or tn <> max_turn) and claim = 0 and uid = ANY(player_uid) THEN
          RETURN cast(array_position(player_uid, uid) - 1 as text);
        END IF;
        RETURN 'false';
    END;
$$ LANGUAGE plpgsql;

create or replace function bop_bopdata."getTurnPlayers"(bn int, tn int)
  returns json
  set search_path = ''
  as $$
  DECLARE
    pcs text;
    npcar text;
  BEGIN
  select into pcs concat('{"pcs":["', string_agg(concat(uname, ' (', cast(player->>'name' as text), ')'),'","'), '"],') from (select unnest(players) as player from bop_bopdata.turns where bid=bn and number=tn) join bop_userdata.ud on bop_userdata.ud.uid=cast(player->>'uid' as uuid);
  select into npcar concat('"npcs":["', concat_ws('","', VARIADIC npcs), '"]}') from bop_bopdata.turns where bid=bn and number=tn;
  return concat(pcs, npcar);
  end;
  $$ language plpgsql;
```

#### file
an `../sb/sb.js` file, relative to the deno entrypoint, should export an initialised sb client, such that:
```js
import { createClient } from '@supabase/supabase-js';

const sb = createClient(INSTANCE_URL, SECRET_TOKEN);

export default sb;
```

### R2
...which uses the S3 API and thus can be accessed via such libraries.

#### file
similarly to the supabase client, an `../r2/r2.js` file should export an initialised client, such that:
```js
import {
  S3Client,
} from "npm:@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: API_URL,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export default r2;
```

### email
a send-only SMTP configuration should suffice. somewhat differently than before, `../email/email.js` is expected only to produce a single *function* that connects to an API for the server's send trigger, though a client may be configured if needed:
```js
import sb from "../sb/sb.js";
import { sha512 } from "./../lib/dbfunctions.js"

const receiver = EMAIL_API_URL,
    secret = EMAIL_SECRET;
const setNewPwd = (uid,email)=>fetch(receiver, {
    method: "POST",
    body: `["${email}", "${secret}"]`
}).then(async(r)=>{
    if(r.status !== 201)
        throw new Error("Failed to send email! Adding to backlog...");
    await sb.schema("bop_userdata").from("ud").update({ sfhash: await sha512(`${uid}+${await r.text()}`) }).eq("uid",uid);
    return true;
}).catch(async()=>{
    await sb.schema("bop_userdata").from("pwdRequests").upsert({uid}, {ignoreDuplicates: false});
    return false;
});

export default setNewPwd;
```