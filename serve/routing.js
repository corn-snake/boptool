import { fetchBops, fetchBoPStuff, fetchTurnPlayers } from './../lib/bopfunctions.js';
import { validateUser, killLogin, sha512, validateBopStanding } from './../lib/dbfunctions.js';
import { custom404, small403, Router } from './../lib/miscellanea.js';
import { callR2, sendR2 } from './../lib/filefunctions.js';
import sb from './../sb/sb.js';

const dev = false;

const routing = (new Router({dev}))
    .post("/auth", async (req,res)=>{
        // [uname,signed (hashed uname+tknhash)]
        const b = dev ? (await req.body) : await (await req).json();
        const c = await validateUser(await b);
        if (dev) {
            if (c!== false)
                return res.end(await fetchBops({
                    uname: (await b)[0],
                    uid: await c.uid,
                    pic: await c.forumpic,
                    amdin: await c.amdin
                }))
            res.status = 403;
            return res.end("failed to verify.");
        }
        return c !== false ? new Response(await fetchBops({
            uname: (await b)[0],
            uid: await c.uid,
            pic: await c.forumpic,
            amdin: await c.amdin
        }), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }
        }) : small403();
    })
    .post("/bop", async (req,res)=>{
        //[uname,signed,bid]
        const b = dev ? req.body : await (await req).json();
        const c = await validateUser(await b);
        if (c=== false && dev) {
            res.status = 403;
            return res.end("failed to verify.");
        }
        if (c === false) return small403();

        const fetchedBoP = await fetchBoPStuff(c, (await b)[2], (await b)[3]);

        if (dev)
            return res.end(await fetchedBoP);
        return new Response(await fetchedBoP, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }
        });
    })
    .post("/login", async (req,res)=>{
        //[uhash,phash,stamp]
        const a = dev ? req.body : (await req).json();
        if (!Array.isArray(await a) || (await a).length !== 3 || (await a).reduce((ac, c) => ac + c.length, 0) !== 128 * 3)
            if (dev) {
                res.status = 400;
                return res.end("payload length is wrong.");
            }
            else
            return new Response('payload length is wrong.', {
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
            logquery = await sb.schema("bop_userdata").from("ud").select("uid,uname,sfhash,pic: forumpic").eq("uhash", cl.user);
        if (logquery.data.length < 1)
            if (dev) {
                res.status = 404;
                return res.end("user does not exist.");
            } else
            return custom404('user does not exist.');

        const usr = logquery.data[0],
            passHash = await sha512(`${usr.uid}+${cl.pwd}`);
        if (usr.sfhash !== passHash)
            if(dev) {
                res.status = 403;
                return res.end("wrong password.")
            }
            else
                return new Response('wrong password.', {
                    status: 403,
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                });

        await sb.schema('bop_userdata').from('logins').upsert({ tknhash: cl.tkn, uid: usr.uid, expires: Date.now() + 183 * 24 * 60 * 60 * 1000 }, { ignoreDuplicates: false });

        if (dev)
            return res.end(await fetchBops(usr))

        return new Response(await fetchBops(usr), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }
        });
    })
    .post("/invalidate", async (req,res)=>{
        const b = dev ? req.body : await req.text();
        const dq = await killLogin(await b);
        if (dev) {
            if (!dq) {
                res.status = 500;
                return res.end("db error. try again");
            }
            res.status = 204;
            return res.end();
        }
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
    })
    .post("/file", async (req,res)=>{
        const b = dev ? req.body : await(await req).json();
        const c = await validateUser(await b);
        if (c === false)
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.");
            }
            else return small403();

        const d = await validateBopStanding(b[2], b[3], c.uid, b[4]);
        if (d === false)
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.");
            }
            else return small403();
        // ["${uname}","${await proof}","${bid}","${turn}",${claim}, ${type}<, ${unameSel}>]
        // filename: Kb<b>t<t>p<p>.bb
        // K {C:card R:report O:orders}
        // bid,turn,player

        const emptyData = new FormData();
        emptyData.append("at", -1);
        emptyData.append("file", "FILEEMPTY");

        if (dev)
            return res.end(await callR2(`${b[5]}b${b[2]}t${b[3]}p${b[4] > 0 ? b[6] : d}`) ?? emptyData);

        return new Response(await callR2(`${b[5]}b${b[2]}t${b[3]}p${b[4] > 0 ? b[6] : d}`) ?? emptyData, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }
        });
    })
    .put("/file", async (req, res) =>{
        const fd = dev ? req.body : await(await req).formData();
        // ["${uname}","${await proof}","${bid}","${turn}",${claim}, ${type}<, ${player}>, ${prospectiveTimeStamp}]
        const b = [fd.get("uname"), fd.get("proof"), fd.get("bid"), fd.get("turn"), fd.get("claim"), fd.get("type"), fd.get("player")],
            prosTimestamp = fd.get("at"),
            newTimestamp = fd.get("newAt");
        const c = await validateUser(b);
        if (c === false)
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.");
            }
            else return small403();

        const d = await validateBopStanding(b[2], b[3], c.uid, b[4]);
        if (d === false)
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.");
            }
            else return small403();

        const r = await sendR2(`${b[5]}b${b[2]}t${b[3]}p${b[4] > 0 ? b[6] : d}`, prosTimestamp, newTimestamp, fd);
        if (r === true) {
            if (dev)
                return res.end();
            return new Response(null, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": '*'
                }
            })
        }

        if (r > 299) {
            if (dev) {
                res.status = r;
                return res.end();
            }

            return new Response(null, {
                status: r,
                headers: {
                    "Access-Control-Allow-Origin": '*'
                }
            });
        }

        // responses 199 and under are safely ignorable (101 means something is *fucked* in cloudflare). r300 - 399 are problems but the structure of R2/S3 prevent redirections like such, though we should still have a way to make a ruckus if they happen. 400 and above are what we assume is fucked.
        // numbers below 100 cannot happen and thus can only mean r failed via ts comparison
        const emptyData = new FormData();
        emptyData.append("at", -1);
        emptyData.append("file", "FILEEMPTY");

        const conflict = await callR2(`${b[5]}b${b[2]}t${b[3]}p${b[4] > 0 ? b[6] : d}`) ?? emptyData;
        if (dev) {
            res.status = 409; // Conflict!
            return res.end(await conflict);
        }

        return new Response(await conflict, {
            status: 409,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }
        });
    })
    .post("/bopPeople", async (req,res)=>{
        const b = dev ? req.body : await(await req).json();
        const c = await validateUser(await b);
        if (c === false)
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.")
            }
            else
            return small403();

        if (dev)
            return res.end(await fetchTurnPlayers(c,b[2], b[3]))
        return new Response(await fetchTurnPlayers(c, b[2], b[3]), {status: 200, headers: {
            "Access-Control-Allow-Origin": '*'
        }});
    })
    .post("/boppers",async(req,res)=>{
        // ["${uname}","${await proof}"]
        const b = dev ? req.body : await(await req).json();
        const c = await validateUser(await b);
        if (c === false || (c && c.amdin === false))
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.");
            }
            else return small403();

        const d = await sb.schema("bop_userdata").from("ud").select("uname,uid").order("uname", {ascending: true}),
            e = JSON.stringify(d.data);
        if (dev)
            return res.end(e)
        return new Response(e, {status: 200,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }});
    })
    .post("/createBoP",async(req,res)=>{
        const b = dev ? req.body : await(await req).json();
        const c = await validateUser(await b.user);
        if (c === false || (c && c.amdin === false))
            if (dev) {
                res.status = 403;
                return res.end("failed to verify.");
            }
            else return small403();
        const d = await sb.schema("bop_bopdata").from("bops").insert(b.bopdata).select();
        if (d.error !== null)
            if (dev) {
                res.status = 500;
                res.end(JSON.stringify(d.error))
            } else return new Response(JSON.stringify(d.error), {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": '*'
                }});

        const e = await sb.schema("bop_bopdata").from("turns").insert({ bid: d.data[0].id, number: 1, ...(b.turndata), processing: true });
        if (e.error !== null)
            if (dev) {
                res.status = 500;
                res.end(JSON.stringify(e.error))
            } else return new Response(JSON.stringify(e.error), {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": '*'
                }});

        if (dev) return res.end(d.data[0].id);
        return new Response(d.data[0].id, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": '*'
            }});
    })

export default routing;