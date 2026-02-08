<script setup>
    import { computed, reactive, ref, watch } from "vue";
    import { compBop } from "../stores/bopstore.js";
    import { createBoP, getAllBoppers, reloadData } from "../lib/loadTrack.js";

    defineOptions({
        inheritAttrs: false
    })

    compBop.title = "";

    const screen = ref(0),
        options = ref([]),
        data = reactive({});

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
            data.email = null
            return;
        };
        if (n === 3) {
            data.uid = "";
            data.npd = ""
        };
    });

const setHost = ({ uid }) => data.host = uid,
    setPlayers = e => data.players = e,
    playersSansHost = computed(() => options.value.filter(e => e.uid !== data.host)),
    playersSansCHosts = computed(()=> options.value.filter(e=> e.uid !== data.host && data.chosts.includes(e) !== true ));

    getAllBoppers().then(p => options.value = p);

    const sendBop = e=>{
        e.preventDefault();
        createBoP({...data, chosts: data.chosts.map(({uid})=>uid), players: data.players.map(({uid, name})=>({uid, name}))}).then(async (r)=>{
            if (r.status === 201) {
                const un = localStorage.getItem("uname");
                if (data.host = un || data.chosts.includes(un) || data.players.map(e=>e.uname).includes(un))
                    return reloadData().finally(()=>screen.value = 0)
                return screen.value = 0;
            }
        });
    }
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
            <button class="submitter" @click="sendBop">Create!</button>
        </div>
    </form>
    <form v-if="screen === 2" @submit="e=>e.stopPropagation()">
    </form>
    <form v-if="screen === 3" @submit="e=>e.stopPropagation()">
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