import { ref } from "vue";

const lt = ref(false);
lt.value = matchMedia('(prefers-color-scheme: light)')?.matches ?? false; // jic *something* happens

const load = ref(true),
    finishedFirstFetch = ref(false),
    loadingData = ref(false);

const saveLock = ref(0),
    remoteSaveLock = ref(0),
    playerGetLock =  ref(false);

const pwdDialog = ref(false),
    editingPeople = ref(false);

const overrides = ref(document.getElementById("app").offsetWidth < 601),
    showSide = ref(document.getElementById("app").offsetWidth > 501);

export { load, loadingData, saveLock, remoteSaveLock, playerGetLock, pwdDialog, editingPeople, lt, overrides, showSide, finishedFirstFetch };