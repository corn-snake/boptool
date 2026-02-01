import { ref } from "vue";
import { sha512 } from "../stores/authStore.js";
import { players } from "../stores/bopstore.js";

const setupTsDb = () => new Promise((resolve, reject) => {
    const tsdb_req = window.indexedDB.open("timestamps", 1);
    tsdb_req.onerror = e => reject(e);
    tsdb_req.onupgradeneeded = e => {
        const tsdb = e.target.result;
        tsdb.createObjectStore("file_ts", { keyPath: "file" });
        tsdb.createObjectStore("og_ts", { keyPath: "file" });
    };
    tsdb_req.onsuccess = e => resolve(e.target.result);
});

const load = ref(true),
    makeLoad = () => (load.value = true),
    unLoad = () => (load.value = false);

const list = Object.freeze({
    mod: 1,
    bigMod: 2
});

async function boppise(bid, turn=-1, claim=0) {
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`/api/bop`,{
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${proof}","${bid}","${turn}",${claim}]`,
    }).then(r=>r.json());
}

async function getPlayers(bid, turn, claim=1) {
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`/api/bopPeople`, {
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${proof}","${bid}","${turn}",${claim}]`,
    }).then(r => r.json());
}

const setTimestamp = async (file, ts) => {
    const tsdb = await setupTsDb();
    tsdb.transaction(["file_ts"], "readwrite").objectStore("file_ts").put({ file, at: ts });
},
setOgTimestamp = async (file, ts) => {
    const tsdb = await setupTsDb();
    tsdb.transaction(["og_ts"], "readwrite").objectStore("og_ts").put({ file, at: parseInt(ts) });
},
    getTimestamp = async(filename) => await setupTsDb().then(tsdb=>new Promise((resolve,reject)=>{
        const tx = tsdb.transaction(["file_ts"], "readonly")
        const rq = tx.objectStore("file_ts").get(filename);
        rq.onsuccess = () => resolve(rq.result.at);
        tx.onerror = e => reject(e);
        rq.onerror = e => reject(e);
    })),
    getOgTimestamp = async(filename) => await setupTsDb().then(tsdb=>new Promise((resolve,reject)=>{
        const tx = tsdb.transaction(["og_ts"], "readonly")
        const rq = tx.objectStore("og_ts").get(filename);
        rq.onsuccess = () => resolve(rq.result.at);
        tx.onerror = e => reject(e);
        rq.onerror = e => reject(e);
    }));

const getFileLocal = async (bid, turn, player, type) => {
    try {
        const opfsRoot = await navigator.storage.getDirectory();
        const directoryHandle = await opfsRoot.getDirectoryHandle(bid);
        const orders = await directoryHandle.getFileHandle(
            `${type}${turn}${player > 0 ? "p" + player : ""}`,
        );
        const ordersF = await orders.getFile();
        return await ordersF.text();
    } catch (e) {
        if (e.name === "NotFoundError")
            return false;
        alert(`Something happened while getting local save!\n\nThe following is the error log:\n${e}`);
        return false;
    }
};

async function fileget(bid, turn, claim=0, player, type) {
    if (turn < 1) return "[i][u]This is our very first turn![/u][/i]";
    const local = await getFileLocal(bid, turn, player, type);
    if (local !== false)
        return local;
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`/api/file`, {
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${proof}",${bid},${turn},${claim}, "${type}"${claim > 0 ? ', ' + player : ""}]`,
    }).then(r => r.formData()).then(fd=>{
        setOgTimestamp(`${bid}/${type}${turn}${claim > 0 ? "p" + player : ""}`, fd.get("at"));
        return fd.get("file");
    });
}

const finishedFirstFetch = ref(false);

const saveLock = ref(0),
    remoteSaveLock = ref(0);

const saveFileLocal = (bid, turn, player, type) => (event) => {
    const f = async (evn) => {
        saveLock.value += 1;
        try {
            const opfsRoot = await navigator.storage.getDirectory();
            const directoryHandle = await opfsRoot.getDirectoryHandle(bid,
                { create: true },
            ); // one folder per bop (bid)
            const orders = await directoryHandle.getFileHandle(
                `${type}${turn}${player > 0 ? "p" + player : ""}`,
                { create: true },
            ); // naming a specific file per type (card, order, report) + turn + player
            const ordersWr = await orders.createWritable();
            await ordersWr.write(evn.target.value);
            await ordersWr.close();
            await setTimestamp(`${bid}/${type}${turn}${player > 0 ? "p" + player : ""}`, Date.now());
        } catch (e) {
            alert(`Something happened while saving!\n\nThe following is the error log:\n${e}`)
        } finally {
            saveLock.value -= 1;
        }
    };
    window.clearTimeout(() => f(event), 1000);
    window.setTimeout(() => f(event), 1000);
},

    saveFileRemote = (bid, turn, player, type, claim, direct=false) => {
        const makeFD = async () => {
            const fd = new FormData();
            fd.append("type", type);
            fd.append("turn", turn);
            fd.append("player", player);
            fd.append("bid", bid);
            fd.append("uname", localStorage.getItem("uname"));
            fd.append("proof", await sha512(`${localStorage.getItem("uname")}+${localStorage.getItem('stamp')}`));
            fd.append("claim", claim);
            fd.append("at", await getOgTimestamp(`${bid}/${type}${turn}${player > 0 ? "p" + player : ""}`));
            fd.append("newAt", await getTimestamp(`${bid}/${type}${turn}${player > 0 ? "p" + player : ""}`));
            return fd;
        },
            sendRemote = fd=>{
                remoteSaveLock.value += 1;
                return fetch("/api/file", {method: "PUT", body: fd}).finally(()=>remoteSaveLock.value -= 1)
            };
        if (direct === true) return (event) => makeFD().then(fd => {
            fd.append("file", event.target.value);
            return fd;
        }).then(fd => sendRemote(fd));
        return makeFD().then(async(fd) => {
            fd.append("file", await getFileLocal(bid, turn, player, type));
            return fd;
        }).then(fd => sendRemote(fd));
    };

// filename: Kb<b>t<t>p<p>.bb
// K {C:card R:report O:orders}
// bid,turn,player
// ["${uname}","${await proof}","${bid}","${turn}",${claim}, ${type}<, ${unameSel}>]

export {load, makeLoad, unLoad, boppise, fileget, finishedFirstFetch, getPlayers, list, players, saveFileLocal, saveLock, saveFileRemote, remoteSaveLock};