import router from "../router/index.js";
import {ref,reactive} from 'vue';
import { compBop } from "./bopstore.js";

const lastLoginAttemptStatus = ref(0);
const finishedFirstFetch = ref(false);

const boppeList=reactive({
    hosts: [],
    chost:[],
    plays:[],
    names:{}
}),
    usr = reactive({
        name: "",
        pic: "",
        amdin: false
    }),
    list = Object.freeze({
        mod: 1,
        bigMod: 2
    }),
    voidBoPs = ()=>{
        usr.name = "";
        usr.pic = "";
        usr.amdin = false;
        boppeList.hosts = [];
        boppeList.chost = [];
        boppeList.plays = [];
        boppeList.names = {};
        compBop.title = "";
        /*
            plays array: each element is a further array, such that:
                0: bop id
                1: bop name
                2: bop icon (if any)
                3: position in turns of bop
                4: turns availible (only for bops played, not (c)hosted)
        */
    },
    fetchedRefs = async(servoresp)=>{
        usr.name = (await servoresp).usr;
        usr.pic = (await servoresp).pic;
        usr.amdin = (await servoresp).amdin;
        boppeList.admins = (await servoresp).bops.admins;
        boppeList.hosts = (await servoresp).bops.hosts;
        boppeList.chost = (await servoresp).bops.chost;
        boppeList.plays = (await servoresp).bops.plays;
        boppeList.names = Object.fromEntries([...(boppeList.hosts.map(h=>[h[0],h[1]])),...(boppeList.chost.map(c=>[c[0],c[1]])),...(boppeList.plays.map(p=>[p[0],p[1]]))]);
        finishedFirstFetch.value = true;
    }

const sha512 = (str) => crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf =>
    Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')
);

const isAuth = ref(await(async()=>{
    if (localStorage.getItem('stamp') == null) return false;
    const proof = await sha512(`${localStorage.getItem('uname')}+${localStorage.getItem('stamp')}`);
    const conf = await fetch(`/api/auth`, {
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body:`["${localStorage.getItem('uname')}","${await proof}"]`
    }).then(r=>{
        if(r.status == 200) {
            fetchedRefs(r.json())
            return true;
        }
        return false;
    });
    return conf;
})());
const logout = ()=>isAuth.value = false;
const login = ()=>isAuth.value = true;

async function tryAuth(usr,pwd,callback,errorCallback){
    const uHash = await sha512(usr), pHash = await sha512(pwd), rn = Math.floor(Math.random() * 2048), d = Date.now();
    if (!localStorage.getItem("stamp")) {
        localStorage.setItem("stamp",await sha512(`${rn}+${d}+${usr}`));
        localStorage.setItem("uname",usr);
    }
    fetch(`/api/login`,{
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${await uHash}","${await pHash}","${localStorage.getItem("stamp")}"]`
    }).then(r=>{
        lastLoginAttemptStatus.value = r.status;
        if(r.status != 200) {
            localStorage.clear();
            errorCallback();
            return `{user: null}`;
        }
        return r.json()
    }).then(rt=>{
        if (rt == "{user: null}") return;
        login();
        callback();
        fetchedRefs(rt);
        router.push("/");
    });
}

function killLogin(callback){
    fetch(`api/invalidate`,{
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: localStorage.getItem("stamp")
    }).then(r=>{
        callback();
        if(r.status == 204) {
            localStorage.clear();
            logout(); voidBoPs();
            router.push('/login');
        }
    });
}

const changePwd = async(newPwd)=>fetch("/api/oldPwd", {method: "POST",
    body:`["${localStorage.getItem('uname')}","${await sha512(`${localStorage.getItem('uname')}+${localStorage.getItem('stamp')}`)}","${await sha512(newPwd)}"]`
}),
requestReset = async(uname,email)=>fetch("/api/reqChange", {method: "POST",
    body: `["${await sha512(uname)}", "${await sha512(email)}"]`
});

export {list, isAuth, tryAuth, killLogin, boppeList, usr, sha512, lastLoginAttemptStatus, finishedFirstFetch, changePwd, requestReset};