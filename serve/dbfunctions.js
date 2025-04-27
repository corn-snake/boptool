import sb from "./sb/sb.js";

async function sha512(str) {
  return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
  });
}

async function validateUser(b) {
    if ((await b)[1].trim().length !== 128 || (await b)[0].match(/\*/)) return false;
    const authquery = await sb.schema("bop_userdata").from("ud").select("uid,forumpic,logins(tknhash,expires)").eq('uname',(await b)[0].trim());
    if ((await authquery).data == null
        || (await authquery).data.length !== 1
        || (await authquery).data[0].expires < Date.now()
    ) return false;
    let ad = false;
    const uname = (await b)[0].trim();
    for (const it of await authquery.data[0].logins) {
        const task = await sha512(`${await uname}+${(await it).tknhash}`);
        if (await task == (await b)[1].trim()) ad = await it;
    }
    if (ad === false || ad.expires < Date.now()) return false;
    ad = await authquery.data[0];
    return ad;
}

async function validateBopStanding(b,t,u,c) {
  let type = ["players","chosts","host"];
  const authquery = await sb.schema("bop_bopdata").from("turns").select(`${type[c] ?? "players"}`).eq("bid",b).eq("number",t);
  if ((await authquery).data == null
        || (await authquery).data.length !== 1
    ) return false;
  switch (c) {
    case 2:
      if ((await authquery).data[0].host == u)
        return true;
      break;
    default:
      const num = (await authquery).data[0][["players", "chosts"][c] ?? "players"].indexOf(u);
      if (num >= 0)
        return num;
  }
  return false;
}

async function killLogin(b) {
    const dq = await sb.schema("bop_userdata").from('logins').delete().eq('tknhash',await b);
    if ((await dq).error !== null) return false;
    return true;
}

export { validateUser, validateBopStanding, killLogin, sha512 };