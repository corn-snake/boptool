import { ref, reactive, computed } from "vue";
import { sha512 } from "../stores/authStore.js";
import { players } from "../stores/bopstore.js";

const load = ref(true),
    makeLoad = () => (load.value = true),
    unLoad = () => (load.value = false);

const lastIsProcessing = ref(false);

const list = {
    mod: 1,
    bigMod: 2
};

const selectedCountry = ref(null),
    playerNumber = computed(() => players.value.indexOf(selectedCountry.value));

function mapObject(_m=new Map()||[]){
    const _p = Array.isArray(_m) ? new Map(_m) : _m;
    return new Proxy(_p,{
        get(target,name,receiver){
            switch(name){
                case "keys":
                    return [...target.keys()];
                case "reset":
                case "clear":
                    return target.clear;
                case "has":
                    return (th)=>target.has(th);
                case "set":
                    return target.set;
                case "del":
                case "delete":
                case "remove":
                    return target.delete;
                default:
                    return target.get(name);
            }
        },
        set:(target,name,value,receiver)=>target.set(name,value)
    });
}

async function boppise(bid, turn=-1, claim=0) {
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`${location.protocol}//${location.hostname}:800/bop`,{
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${await proof}","${bid}","${turn}",${claim}]`,
    }).then(r=>r.json());
}

async function getPlayers(bid, turn, claim=1) {
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`${location.protocol}//${location.hostname}:800/bopPeople`, {
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${await proof}","${bid}","${turn}",${claim}]`,
    }).then(r => r.json());
}

async function fileget(bid, turn, claim=0, type) {
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`${location.protocol}//${location.hostname}:800/file`, {
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${await proof}",${bid},${turn},${list[claim] || 0}, "${type}"${list[claim] > 0 ? ', ' + playerNumber.value : ""}]`,
    }).then(r => r.text());
}

const finishedFirstFetch = ref(false);

export {load, makeLoad, unLoad, boppise, fileget, mapObject, finishedFirstFetch, lastIsProcessing, getPlayers, list, selectedCountry, playerNumber};