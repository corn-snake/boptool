import { custom403, small403, custom404, mapObject } from './miscellanea.js';
import sb from './sb/sb.js';

function reduceTurns(bopArray) {
    const instanceMap = new Map();
    for (const r of bopArray) instanceMap.set(r.bid,r.number);
    return instanceMap;
}

function filterBoPTurn(sbResult, privilege, uid){
    switch (privilege) {
        case 2:
            return sbResult.host == uid;
            break;
        case 1:
            return sbResult.chosts === null ? false : sbResult.chosts.indexOf(uid) >= 0;
            break;
        default:
            return sbResult.players.indexOf(uid) >= 0;
            break;
    }
}

function getPrivilege(sbResult,uid) {
    if (sbResult.host == uid) return 2;
    if (sbResult.chosts !== null && sbResult.chosts.indexOf(uid) >= 0) return 1;
    if (sbResult.players.indexOf(uid) >= 0) return 0;
    return -1;
}

/* function reduceBoPs_old(bopArray) {
    const instanceMap = new Map();
    let redJoined = [];
    for (const r of bopArray) {
        if(!instanceMap.has(r.bid)) {
            redJoined.push([r.bid,r.bops.name,r.bops.icon]);
            instanceMap.set(r.bid,true)
        }
    }
    return redJoined;
}
// this was used when this fetched all bop info *thrice*, because we were too lazy to do a deep copy or return an object later on
*/

function reduceBoPs(bopArray, lastTurns=new Map(), privilege, uid) {
    const instanceMap = new Map();
    let redJoined = [];
    for (const r of bopArray) {
        if (!filterBoPTurn(r,privilege,uid)) continue;
        if(!instanceMap.has(r.bid)) {
            if (privilege == 0)
                instanceMap.set(r.bid,[r.bops.name,r.bops.icon, lastTurns.get(r.bid),[]]);
            else
                instanceMap.set(r.bid, [r.bops.name, r.bops.icon, lastTurns.get(r.bid)]);
        }

        if (privilege == 0) instanceMap.set(r.bid, [...instanceMap.get(r.bid).slice(0,3), [...instanceMap.get(r.bid)[3], r.number]]);
    }
    redJoined = [...instanceMap.entries()].map((e)=>[e[0], ...e[1]]);
    return redJoined;
}

async function fetchBops(usr){
    const ltR = await sb.schema('bop_bopdata').from('turns').select('bid, number, host, chosts, players, bops(name, icon)').order('bid,number', { ascending: true }),
        ltD = await ltR.data,
        latestTurns = reduceTurns(await ltD);
    const bops = {
            hosts: reduceBoPs(await ltD, latestTurns, 2, await usr.uid),
            chost: reduceBoPs(await ltD, latestTurns, 1, await usr.uid),
            plays: reduceBoPs(await ltD, latestTurns, 0, await usr.uid)
        };
    return JSON.stringify({
            usr: usr.uname,
            pic: usr.forumpic,
            bops: bops
        });
}

function BuildHistory(sbResult,uid) {
    const instanceMap = new mapObject();
    let maxP = getPrivilege(sbResult[0], uid);
    for (const t of sbResult) {
        const gp = getPrivilege(t, uid);
        if (maxP >= 1) {
            instanceMap[t.number] = gp;
            continue;
        }
        if (gp >= 0) instanceMap[t.number] = gp;
    }
    return `${instanceMap}`;
}

async function fetchBoPStuff(udata, bid, turn, claimsMod) {
    const turnAsk = await sb.schema("bop_bopdata").from("turns").select('number,host,chosts,players,inactive').eq("bid",bid).order('number', { ascending: false });
    if ((await turnAsk).data.length < 1) return custom404("bop not found. wo");
    const hist = BuildHistory(await turnAsk.data,udata.uid);
    return new Response(JSON.stringify({
        hist: hist,
        lastIsProcessing: (await turnAsk.data)[0].inactive
    }),{
        status:200,
        headers: {
            "Access-Control-Allow-Origin": '*'
        }
    });
}

async function fetchTurnPlayers(udata, bid, turn=-1) {
    const turnAsk = await sb.schema("bop_bopdata").from("turns").select('number,host,chosts,players,inactive').eq("bid", bid).order('number', { ascending: false });
    if ((await turnAsk).data.length < 1) return custom404("bop not found. wo");
    const c = getPrivilege((await turnAsk).data[0], udata.uid);
    if (c < 1) return custom403("not registered as (co-)host. if you believe this to be an error, contact your bophost. if you are said bophost, contact an admin");
    const actualTurn = turn >= 0 ? turn : (await turnAsk).data[0].number;
    const playersAsk = await sb.schema("bop_bopdata").rpc('getTurnPlayers', { tn: actualTurn, bn: bid });
    return new Response(JSON.stringify([...await playersAsk.data]), {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": '*'
        }
    });
}

/*
select uname from bop_userdata.ud
  where bop_userdata.ud.uid in
  (select unnest(players) from bop_bopdata.turns where bid=bn and number=tn )
*/

export { reduceBoPs, fetchBops, fetchBoPStuff, fetchTurnPlayers };