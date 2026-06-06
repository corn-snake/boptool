import sb from './../sb/sb.js';
import { mapObject } from "./miscellanea.js";

const fetchBops = async(usr) => JSON.stringify({
            usr: usr.uname,
            pic: usr.pic,
            bops: (await sb.schema("bop_bopdata").rpc('getUserBops', { ui: await usr.uid })).data,
            amdin: usr.amdin,
        });

async function completionProgress (b,t,tp) {
    const comp = await sb.schema("bop_bopdata").from("file_ts").select("file").or(`file.ilike.Cb${b}t${t}p_,file.ilike.Rb${b}t${t}p_,file.ilike.Ob${b}t${tp}p_`);
    if (comp.error) return false;
    const progress = mapObject();
    for (const file of (comp.data ?? []).map(e=>e.file)) {
        const pl = file.at(-1),
            ty = file.at(0).toUpperCase(),
            tu = file.at(4);
        if (!(progress[pl] ?? false)) progress[pl] = {};
        if (ty === "O" && parseInt(tu) !== tp) continue;
        progress[pl][ty] = true;
    }
    return progress;
}

async function fetchBoPStuff(udata, bid, nh=true) {
    const lipq = await sb.schema("bop_bopdata").from("bops").select('last_processing, validated, completed').eq("id",bid).limit(1);
    if (nh === false) return lipq.data[0].last_processing;
    const hist = await sb.schema("bop_bopdata").rpc('buildHistory', { uid: udata.uid, bn: bid }),
        progressLatest = await completionProgress(bid, parseInt(hist.data.at(-1)), parseInt(hist.data.at(-2) ?? -1));
    return JSON.stringify({
        hist: (hist.data || []).map(h=>parseInt(h)),
        lastIsProcessing: lipq.data[0].last_processing,
        validated: lipq.data[0].validated,
        completed: lipq.data[0].completed,
        progressLatest
    });
}

async function isMod(bid, uid) {
    const c = await sb.schema("bop_bopdata").rpc('isMod', { bn: bid, uid });
    return c.data ?? false;
}

async function fetchTurnPlayers(udata, bid, turn=-1) {
    const c = await isMod(bid, udata.uid)
    if (c !== 1 && c !== 2) return false;
    const actualTurn = turn >= 0 ? turn : (await sb.schema('bop_bopdata').from('turns').select("number").order('number', {ascending: false}).limit(1)).data[0].number;
    const playersAsk = await sb.schema("bop_bopdata").rpc(c === 2 ? 'getTurnPeople' : 'getTurnPlayers', { tn: actualTurn, bn: bid });
    return JSON.stringify(playersAsk.data);
}

async function getTruePrivillege(b,u) {
    const authquery = await sb.schema("bop_bopdata").rpc('getTruePrivillege', { bn: b, uid: u });
    return authquery.data ?? -1;
}

async function validateBopStanding(b,t,u,c) {
  const authquery = await sb.schema("bop_bopdata").rpc('validateBopStanding', { tn: t, bn: b, claim: c, uid: u });
  return JSON.parse(authquery.data)
}

/*
select uname from bop_userdata.ud
  where bop_userdata.ud.uid in
  (select unnest(players) from bop_bopdata.turns where bid=bn and number=tn )
*/

export { fetchBops, fetchBoPStuff, fetchTurnPlayers, isMod, getTruePrivillege, validateBopStanding, completionProgress };