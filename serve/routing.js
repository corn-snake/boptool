import { reduceBoPs, fetchBops, fetchBoPStuff, fetchTurnPlayers } from './bopfunctions.js';
import { validateUser, killLogin, sha512, validateBopStanding } from './dbfunctions.js';
import { custom404, small403, small404 } from './miscellanea.js';
import { callR2 } from './filefunctions.js';
import sb from './sb/sb.js';

const routing = async r=>{
    switch (r.method) {
        case "POST":
            if (r.url.endsWith('/auth')) {
                // [uname,signed (hashed uname+tknhash)]
                const b = (await r).json();
                const c = await validateUser(await b);
                return c !== false ? new Response(await fetchBops({
                    uname: (await b)[0],
                    uid: await c.uid,
                    forumpic: await c.forumpic
                }), {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                }) : small403();
            }
            if (r.url.endsWith('/bop')) {
                //[uname,signed,bid,turn,claim]
                const b = (await r).json();
                const c = await validateUser(await b);
                if (c === false) return small403();
                const fetchedBoP = await fetchBoPStuff(c, (await b)[2], (await b)[3], (await b)[4]);
                return fetchedBoP;
            }
            if (r.url.endsWith('/login')) {
                //[uhash,phash,stamp]
                const a = (await r).json();
                if (!Array.isArray(await a) || (await a).length !== 3 || (await a).reduce((ac, c) => ac += c.length, 0) !== 128 * 3) return new Response('payload length is wrong.', {
                    status: 400,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                });
                const b = (await a).map((e) => e.trim()),
                    cl = {
                        user: await b[0],
                        pwd: await b[1],
                        tkn: await b[2]
                    },
                    logquery = await sb.schema("bop_userdata").from("ud").select("uid,uname,sfhash,forumpic").eq("uhash", cl.user);
                if ((await logquery).data.length < 1) return custom404('user does not exist.');
                const usr = (await logquery).data[0],
                    passHash = await sha512(`${usr.uid}+${cl.pwd}`);
                if (usr.sfhash !== await passHash) return new Response('wrong password.', {
                    status: 403,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                });
                const accessRow = await sb.schema('bop_userdata').from('logins').upsert({ tknhash: cl.tkn, uid: usr.uid, expires: Date.now() + 183 * 24 * 60 * 60 * 1000 }, { ignoreDuplicates: false });
                return new Response(await fetchBops(usr), {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                });
            }
            if (r.url.endsWith('/invalidate')) {
                const b = await r.text();
                const dq = await killLogin(await b);
                return dq ? new Response(null, {
                    status: 204,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                }) : new Response('db error. try again.', {
                    status: 500,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                });

            }
            if (r.url.endsWith('/file')) {
                const b = await(await r).json();
                const c = await validateUser(await b);
                if (c === false) return small403();
                const d = await validateBopStanding(b[2], b[3], c.uid, b[4]);
                if (d === false) return small403();
                // ["${uname}","${await proof}","${bid}","${turn}",${claim}, ${type}<, ${unameSel}>]
                // filename: Kb<b>t<t>p<p>.bb
                // K {C:card R:report O:orders}
                // bid,turn,player
                return new Response(await callR2(`${b[5]}b${b[2]}t${b[3]}p${b[4] > 0 ? b[6] : d}`) ?? "FILEEMPTY", {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                });
            }
            if (r.url.endsWith('/bopPeople')) {
                const b = await(await r).json();
                const c = await validateUser(await b);
                if (c === false) return small403();
                return fetchTurnPlayers(c, b[2], b[3]);
            }
            return small404();
        default:
            return small404();
    }
}

export default routing;