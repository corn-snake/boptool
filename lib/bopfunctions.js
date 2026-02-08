import { custom403 } from './miscellanea.js';
import sb from './../sb/sb.js';

const fetchBops = async(usr) => JSON.stringify({
            usr: usr.uname,
            pic: usr.pic,
            bops: (await sb.schema("bop_bopdata").rpc('getUserBops', { ui: await usr.uid })).data,
            amdin: usr.amdin,
        });

async function fetchBoPStuff(udata, bid, nh=true) {
    const lipq = await sb.schema("bop_bopdata").from("turns").select('processing').eq("bid",bid).order('number', { ascending: false }).limit(1);
    if (nh === false) return lipq.data[0].processing;
    const hist = await sb.schema("bop_bopdata").rpc('buildHistory', { uid: udata.uid, bn: bid });
    return JSON.stringify({
        hist: hist.data.map(h=>parseInt(h)),
        lastIsProcessing: lipq.data[0].processing
    });
}

async function fetchTurnPlayers(udata, bid, turn=-1) {
    const c = await sb.schema("bop_bopdata").rpc('isMod', { bn: bid, uid: udata.uid });
    if (c.data !== true) return custom403("not registered as (co-)host. if you believe this to be an error, contact your bophost. if you are said bophost, contact an admin");
    const actualTurn = turn >= 0 ? turn : (await sb.schema('bop_bopdata').from('turns').select("number").order('number', {ascending: false}).limit(1)).data[0].number;
    const playersAsk = await sb.schema("bop_bopdata").rpc('getTurnPlayers', { tn: actualTurn, bn: bid });
    return JSON.stringify(playersAsk.data);
}

/*
select uname from bop_userdata.ud
  where bop_userdata.ud.uid in
  (select unnest(players) from bop_bopdata.turns where bid=bn and number=tn )
*/

export { fetchBops, fetchBoPStuff, fetchTurnPlayers };