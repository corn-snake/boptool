import { reactive } from "vue";
import { ref } from "vue";

const initSettings = JSON.parse(localStorage.getItem("settings") || "{}");

const lt = ref(initSettings.lt ?? true);

const load = ref(true),
    finishedFirstFetch = ref(false),
    loadingData = ref(false);

const saveLock = ref(0),
    remoteSaveLock = ref(0),
    playerGetLock =  ref(false);

const pwdDialog = ref(false),
    editingPeople = ref(false);

const overrides = ref(document.getElementById("app").offsetWidth < 601),
    showSide = ref(initSettings.showSide ?? document.getElementById("app").offsetWidth > 501);

const settings = reactive(initSettings);

export { load, loadingData, saveLock, remoteSaveLock, playerGetLock, pwdDialog, editingPeople, lt, overrides, showSide, finishedFirstFetch, settings };