built with vue & deno. install nodejs & deno first, then get into the folder via commandline & run `npm i`. when that's done go to the `serve` folder & run that again.
once that's done, go back & run `deno task sdev`, open another commandline window, and `deno task dev`. hopefully everything "works"

---

the deno server connects to a supabase instance and an r2 bucket to hold all of the state data; these can in theory be replaced with more consolidated interfaces to a local postgres server and file read/write calls should server resources not be concerns.
there are, at present, five database functions the server calls through RPC of to offload some more expensive processing. these are:
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

      select into playsjn concat('[', string_agg(cc, ','), ']') from (select concat('[', id, ',"', name, '","', icon, '",', cast(max(number) as text), ',[', string_agg(concat('{"number":', number, ',"name":"', cast(player->>'name' as text), '"}'), ','), ']]') as cc
        from (select unnest(players) as player, bid, number from bop_bopdata.turns)
        join bop_userdata.ud on cast(player->>'uid' as uuid)=bop_userdata.ud.uid
        join bop_bopdata.bops on bop_bopdata.bops.id=bid
        where ui=bop_userdata.ud.uid
        group by bop_bopdata.bops.id);

    RETURN concat('{"hosts": ', hostsjn, ', "chost": ', chostsjn, ', "plays": ', playsjn, '}');
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bop_bopdata."buildHistory"(uid uuid, bn int)
  RETURNS int[]
  set search_path = ''
  AS $$
    DECLARE
      latesturn record;
    BEGIN
    select into latesturn host, chosts, players from bop_bopdata.turns where bop_bopdata.turns.bid=bn order by number desc limit 1;
    IF latesturn.host = uid or uid = ANY(latesturn.chosts) then
      return (select array(select number from bop_bopdata.turns where bop_bopdata.turns.bid=bn order by number asc));
    ELSIF (select uid in (select cast(unnest(latesturn.players)->>'uid' as uuid))) then
      return (select array(select number from (select number, cast(unnest(players)->>'uid' as uuid) as player from bop_bopdata.turns where bop_bopdata.turns.bid=bn) where player=uid order by number asc));
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
        IF claim = 0 and uid = ANY(player_uid) THEN
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

the structure of the database is divided into two schemata, `bop_bopdata` and `bop_userdata`.