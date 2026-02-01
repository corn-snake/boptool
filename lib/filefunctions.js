import sb from "./../sb/sb.js";
import r2 from "../r2/r2.js";
import {
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";

async function callR2(filename) {
    if(filename.endsWith(-1)) return null;
    const c = await r2.send(
        new GetObjectCommand({
            Bucket: "boptool",
            Key: `${filename}.bb`,
        }),
    ).catch(e=>e);
    if (c.$metadata.httpStatusCode > 299 || c.$metadata.httpStatusCode < 200) return null;
    const t = await c.Body.transformToString();
    const h = new FormData();
    h.append("at", (await sb.schema("bop_bopdata").from("file_ts").select("at").eq("file",filename)).data[0].at);
    h.append("file", t);
    return h;
}

async function sendR2(filename, ts, newTs, body=new FormData()) {
    const timestampquery = await sb.schema("bop_bopdata").from("file_ts").select("at").eq("file",filename);
    if (parseInt(ts) > 0 && timestampquery.data.length > 0 && parseInt(ts) !== timestampquery.data[0].at) return -1;
    const c = await r2.send(
      new PutObjectCommand({
        Bucket: "boptool",
        Key: `${filename}.bb`,
        Body: body.get("file"),
      }),
    );
    if ((await c).$metadata.httpStatusCode > 200) return (await c).$metadata.httpStatusCode;
    sb.schema("bop_bopdata").from("file_ts").upsert({file: filename, at: newTs}).select();
    return true;
}

export { callR2, sendR2 };