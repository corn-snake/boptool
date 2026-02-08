import sb from "./../sb/sb.js";

const sha512 = (str) => crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf =>
    Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')
);

async function validateUser(b) {
    if ((await b)[1].trim().length !== 128 || (await b)[0].match(/\*/)) return false;
    const authquery = await sb.schema("bop_userdata").from("ud").select("uid,forumpic,amdin,logins(tknhash,expires)").eq('uname',(await b)[0].trim());
    if ((await authquery).data == null
        || (await authquery).data.length !== 1
        || (await authquery).data[0].expires < Date.now()
    ) return false;
    let ad = false;
    const uname = (await b)[0].trim();
    for (const it of authquery.data[0].logins) {
        const task = await sha512(`${await uname}+${(await it).tknhash}`);
        if (task == (await b)[1].trim()) ad = await it;
    }
    if (ad === false || ad.expires < Date.now()) return false;
    ad = await authquery.data[0];
    return ad;
}

async function validateBopStanding(b,t,u,c) {
  const authquery = await sb.schema("bop_bopdata").rpc('validateBopStanding', { tn: t, bn: b, claim: c, uid: u });
  return JSON.parse(authquery.data)
}

async function killLogin(b) {
    const dq = await sb.schema("bop_userdata").from('logins').delete().eq('tknhash',await b);
    if ((await dq).error !== null) return false;
    return true;
}

export { validateUser, validateBopStanding, killLogin, sha512 };