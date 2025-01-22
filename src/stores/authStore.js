import router from "../router";
import {ref,reactive} from 'vue';

const boppeList=reactive({
    hosts: [],
    chost:[],
    plays:[]
}),
    usr = reactive({
        name: "",
        pic: ""
    }),
    voidBoPs = ()=>{
        usr.name = "";
        usr.pic = "";
        boppeList.hosts = [];
        boppeList.chost = [];
        boppeList.plays = [];
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
        boppeList.hosts = (await servoresp).bops.hosts;
        boppeList.chost = (await servoresp).bops.chost;
        boppeList.plays = (await servoresp).bops.plays;
    }

async function sha512(str) {
  return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
  });
}

let isAuth = ref(await(async()=>{
    if (localStorage.getItem('stamp') == null) return false;
    const proof = await sha512(`${localStorage.getItem('uname')}+${localStorage.getItem('stamp')}`);
    let conf = await fetch(`${location.protocol}//${location.hostname}:800/auth`, {
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

export async function tryAuth(usr,pwd,callback){
    const uHash = await sha512(usr), pHash = await sha512(pwd), rn = Math.floor(Math.random() * 2048), d = Date.now();
    if (!localStorage.getItem("stamp")) {
        localStorage.setItem("stamp",await sha512(`${rn}+${d}+${usr}`));
        localStorage.setItem("uname",usr);
    }
    fetch(`${location.protocol}//${location.hostname}:800/login`,{
        "Access-Control-Allow-Origin": '*',
        method: "POST",
        body: `["${await uHash}","${await pHash}","${localStorage.getItem("stamp")}"]`
    }).then(r=>{
        if(r.status != 200) return `{user: null}`
        return r.json()
    }).then(rt=>{
        if (rt == "{user: null}") return;
        login();
        callback();
        fetchedRefs(rt);
        router.push("/");
    });
}

export async function killLogin(callback){
    fetch(`${location.protocol}//${location.hostname}:800/invalidate`,{
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

export {isAuth,boppeList,usr,sha512};