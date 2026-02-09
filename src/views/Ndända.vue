<script setup>
    import { computed, reactive, ref, watch } from "vue";
    import { compBop } from "../stores/bopstore.js";
    import { createBoP, createUser, getAllBoppers, reloadData, resetPwd } from "../lib/runtimeActs.js";

    defineOptions({
        inheritAttrs: false
    })

    compBop.title = "";

    const screen = ref(0),
        options = ref([]),
        choice = reactive({
            pic: false,
            sv: false
        }),
        data = reactive({}),
        breathing = ref(false);

    watch(() => screen.value, n => {
        Object.keys(data).forEach(d=>data[d] = undefined);
        if (n === 1) {
            data.name = "";
            data.icon = "";
            data.host = "";
            data.chosts = [];
            data.players = [];
            data.npcs = [];
            return;
        }
        if (n === 2) {
            data.uname = "";
            data.pic = "";
            data.email = "";
            data.pwd = "";
            data.pwd2 = "";
            return;
        };
        if (n === 3) {
            data.uid = "";
            data.npd = "";
            data.npd2 = "";
        };
    });

const setHost = ({ uid }) => data.host = uid,
    setPlayers = e => data.players = e,
    playersSansHost = computed(() => options.value.filter(e => e.uid !== data.host)),
    playersSansCHosts = computed(()=> options.value.filter(e=> e.uid !== data.host && data.chosts.includes(e) !== true )),
    setUser = ({uid})=>data.uid = uid;

    getAllBoppers().then(p => options.value = p);

    const sendBop = e=>{
        e.preventDefault();
        if (data.host.length === 0)
            return alert("missing host!");
        if (data.players.length === 0 && !(confirm("send with no players?")))
            return;
        breathing.value = true;
        createBoP({...data, chosts: data.chosts.map(({uid})=>uid), players: data.players.map(({uid, name})=>({uid, name}))}).then(async (r)=>{
            if (r.status === 201) {
                const un = localStorage.getItem("uname");
                if (data.host = un || data.chosts.includes(un) || data.players.map(e=>e.uname).includes(un))
                    return reloadData().finally(()=>screen.value = 0)
                return screen.value = 0;
            }
        }).finally(()=>breathing.value = false);
    },
    sendUser = (e)=>{
        e.preventDefault();
        if (data.uname.length < 4)
            return alert("missing username!")
        if (data.pwd.length < 7)
            return alert("missing password!")
        if (data.pwd !== data.pwd2)
            return alert("passwords do not match!")
        if (data.email.length < 11 && !confirm("send without email? you'll have to reset their password manually"))
            return alert("missing email!")
        if (data.email.length >= 11 && (/[a-zA-Z0-9\-\.]{3,}@[a-zA-Z0-9\-\.]{4,}\.[a-zA-Z]{2,}/g).test(data.email) !== true)
            return alert("email is invalid!")
        breathing.value = true;
        createUser({uname: data.uname, email: data.email, forumpic: data.pic}, data.pwd).finally(()=>breathing.value = false);
    },
    sendNewPwd = (e)=>{
        e.preventDefault();
        if (data.uid.length < 4)
            return alert("missing username!")
        if (data.npd.length < 7)
            return alert("missing password!")
        if (data.npd !== data.npd2)
            return alert("passwords do not match!")
        breathing.value = true;
        resetPwd({uid: data.uid, pwd: data.npd}).finally(()=>breathing.value = false);
    };
</script>
<template>
    <nav class="actions flex columnar">
        <h2>Actions</h2>
        <div class="belt">
            <button @click="screen = 1" :class="['eztheme', screen === 1 ? 'ded' : '']">+ Game</button>
            <button @click="screen = 2" :class="['eztheme', screen === 2 ? 'ded' : '']">+ Account</button>
            <button @click="screen = 3" :class="['eztheme', screen === 3 ? 'ded' : '']">Pwd change</button>
        </div>
    </nav>
    <form v-if="screen === 1" class="flex columnar" @submit="e=>e.preventDefault()">
        <h3>Game registration</h3>
        <div class="reg fit">
            <div class="fit">
                <label for="boptitle">Name:</label>
                &nbsp;
                <input type="text" name="boptitle" id="boptitle" v-model="data.name">
            </div>
            <div class="fit">
                <label for="bophost">Host:</label>
                &nbsp;
                <vselect name="bophost" id="bophost" label="uname" :options="options" @option:selected="setHost" />
                <br/>
                <label for="cohosts">Cohosts:</label>
                &nbsp;
                <vselect name="cohosts" id="cohosts" label="uname" :options="playersSansHost" multiple @option:selected="s=>data.chosts = s" />
            </div>
            <div class="fit">
                <label for="bopplayers">Players:</label>
                &nbsp;
                <vselect name="bopplayers" id="bopplayers" label="uname" :options="playersSansCHosts" @option:selected="setPlayers" multiple />
                <br/>
                <ul>
                    <li v-for="player in data.players">
                        <label :for="`${player.uname}-country`">{{ player.uname }}</label>
                        &nbsp;as&nbsp;
                        <input type="text" :name="`${player.uname}-country`" :id="`${player.uname}-country`" v-model="player.name" />
                    </li>
                </ul>
            </div>
            <div class="fit">
                <label for="bopnpcs">NPCs:</label>
                &nbsp;
                <input type="number" min="0" value="0" step="1" name="bopnpcs" id="bopnpcs" @input="e => {
                    if (parseInt(e.target.value) > 0 && data.npcs.length >= 0 && data.npcs.length < parseInt(e.target.value))
                        return data.npcs.push(...(Array(parseInt(e.target.value) - data.npcs.length).fill('')));
                    if (parseInt(e.target.value) >= 0 && data.npcs.length >= 0 && data.npcs.length > parseInt(e.target.value))
                        return data.npcs.splice(data.npcs.length - data.npcs.length + parseInt(e.target.value));
                }" />
                <br/>
                <ol>
                    <li v-for="npc, num in data.npcs">
                        <input type="text" v-model="data.npcs[num]" />
                    </li>
                </ol>
            </div>
            <button :class="['submitter', breathing ? 'breathing' : '']" @click="sendBop">Create!</button>
        </div>
    </form>
    <form v-if="screen === 2" class="flex columnar" @submit="e=>e.stopPropagation()">
        <h3>User registration</h3>
        <div class="reg fit">
            <div class="fit">
                <label for="uname">Username:</label>
                &nbsp;
                <input type="text" name="uname" id="uname" v-model="data.uname"/>
            </div>
            <div class="fit">
                <label for="pwd">Password:</label>
                &nbsp;
                <input type="password" name="pwd" id="pwd" v-model="data.pwd"/>
                <br/>
                <label for="pwdConf">Confirm:</label>
                <input type="password" name="pwdConf" id="pwdConf" v-model="data.pwd2"/>
            </div>
            <div class="fit">
                <label for="email">Email address:</label>
                &nbsp;
                <input type="email" name="email" id="email" v-model="data.email"/>
            </div>
            <div class="fit">
                <label for="pic">Picture?</label>&nbsp;<input type="checkbox" name="pic" id="pic" v-model="choice.pic"/><br/>
                <span v-if="choice.pic"><label for="url">Image URL:</label>&nbsp;<input type="url" name="url" id="url" v-model="data.pic"/></span>
            </div>
            <button :class="['submitter', breathing ? 'breathing' : '']" @click="sendUser">Create!</button>
        </div>
    </form>
    <form v-if="screen === 3" class="flex columnar" @submit="e=>e.stopPropagation()">
        <h3>Reset a password</h3>
        <div class="reg fit">
            <div class="fit">
                <label for="user">User:</label>
                &nbsp;
                <vselect name="bophost" id="bophost" label="uname" :options="options" @option:selected="setUser" />
            </div>
            <div class="fit">
                <label for="pwd">New password:</label>
                &nbsp;
                <input type="password" name="pwd" id="pwd" v-model="data.npd"/>
                <br/>
                <label for="pwdConf">Confirm:</label>
                &nbsp;
                <input type="password" name="pwdConf" id="pwdConf" v-model="data.npd2"/>
            </div>
            <button :class="['submitter', breathing ? 'breathing' : '']" @click="sendNewPwd">Create!</button>
        </div>
    </form>
</template>
<style scoped>
    nav.actions {
        align-items: center;
        box-shadow:0px 0px 5px 2px rgba(129,81,39,0.5);
        padding-bottom: 1.2rem;
    }
    .actions h2 {
        width: fit-content;
        font-style: italic;
    }
    .belt {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }
    form {
        margin: 1.5rem;
        align-items: center;
    }
    form h3 {
        padding: 0 0 1rem 0;
        text-align: center;
    }
    .reg > *:not(:last-child) {
        margin-bottom: 5px;
    }
    form input {
        border-bottom: 1px solid;
    }
    button.ded {
        background-color: var(--linkcolor);
        color: white;
    }
    .dt button.ded {
        color: white;
    }
</style>