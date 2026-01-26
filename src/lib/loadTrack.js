import { ref, computed } from "vue";
import { sha512 } from "../stores/authStore.js";
import { players } from "../stores/bopstore.js";

const load = ref(true),
    makeLoad = () => (load.value = true),
    unLoad = () => (load.value = false);

const lastIsProcessing = ref(false);

const list = Object.freeze({
    mod: 1,
    bigMod: 2
});

const selectedCountry = ref(null),
    playerNumber = computed(() => players.value.indexOf(selectedCountry.value));

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

async function fileget(bid, turn, claim=0, player, type) {
    const uname = localStorage.getItem('uname'),
        proof = await sha512(`${uname}+${localStorage.getItem('stamp')}`);
    return await fetch(`${location.protocol}//${location.hostname}:800/file`, {
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${uname}","${await proof}",${bid},${turn},${claim}, "${type}"${claim > 0 ? ', ' + player : ""}]`,
    }).then(r => r.text());
}

const finishedFirstFetch = ref(false);

export {load, makeLoad, unLoad, boppise, fileget, finishedFirstFetch, lastIsProcessing, getPlayers, list, players, selectedCountry, playerNumber};