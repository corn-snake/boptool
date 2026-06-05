<script setup>
    import { editingPeople, playerGetLock } from '../../stores/bellsandwhistles';
    import { getAllBoppers, openPeopleEditor, closePeopleEditor, saveNewBoPData, getPlayers } from '../../lib/runtimeActs';
    import { bopData, cohosters, players, nonplayables, compBop } from '../../stores/bopstore';
    import { computed, ref } from 'vue';
    import ShyEditable from '../primitives/ShyEditable.vue';

    const bthUpd = ref(false);

const options = ref([]),
    pushNPC = e => {
        e.preventDefault();
        nonplayables.value.push({name: `NPC ${nonplayables.value.length + 1}`})
    },
    pushPlayer = e => {
        e.preventDefault();
        players.value.push({name:`Player ${players.value.length + 1}`, player:undefined})
    },
    makeNPC = (e,i) => {
        e.preventDefault();
        players.value[i].player = undefined;
        nonplayables.value.push(players.value[i]);
        players.value.splice(i, 1);
    },
    removePlayer = (e, i)=>{
        e.preventDefault();
        if (!(players.value[i].number ?? false)) return players.value.splice(i,1)
        players.value[i].name = null;
        players.value[i].player = null;
    },
    removeNPC = (e,i)=>{
        e.preventDefault();
        if (!(nonplayables.value[i].number ?? false)) return nonplayables.value.splice(i,1)
        nonplayables.value[i].name = null;
    },
    makePlayer = (e,i)=>{
        e.preventDefault();
        const p = nonplayables.value[i];
        players.value.push(p);
        nonplayables.value.splice(i,1);
    };

    getAllBoppers().then(p => (p[0].uid ?? false) ? options.value = p.map(player=>player.uname) : options.value = p);
    const allSansHost = computed(() => options.value.filter(e => e !== localStorage.getItem('uname'))),
    allSansCHostsAndPlayers = computed(()=> options.value.filter(e=> e !== localStorage.getItem('uname') && cohosters.value.includes(e) !== true && !players.value.some(p=>p.player === e) ));

    const sendNewBoPData = e=>{
        e.preventDefault();
        if (players.value.some(p=>p.player === undefined)) return alert("There's a played country without an assigned player! Either make them an NPC of delete them.");
        bthUpd.value=true;
        saveNewBoPData(bopData.bop, compBop.history.at(-1), cohosters.value, players.value, nonplayables.value).then(async(r)=>{
            if(r.status !== 200) {
                bthUpd.value = false;
                return alert("Error!\n\n" + await r.text());
            }
            playerGetLock.value = true;
            getPlayers(bopData.bop, bopData.turn, bopData.claim).then(({pcs, chosts, npcs}) => {
           	    players.value = pcs;
                nonplayables.value = npcs;
                cohosters.value = chosts?.filter(Boolean).filter(e=>e.length > 1) ?? [];
                if (bopData.player >= 0) {
                    const plyr = players.value.at(bopData.player).player;
                    if (players.value.findIndex(p=>p.player === plyr) < 0)
                        return bopData.player = -1;
                    else
                        return bopData.player = players.value.findIndex(p=>p.player === plyr);
                }
                bthUpd.value = false;
                closePeopleEditor();
                playerGetLock.value = false;
            })
        });
    };
</script>
<template>
    <button class="eztheme" @click="e=>{e.stopPropagation(); openPeopleEditor()}">
        Edit
    </button>
    <dialog class="peopleEditor burntivory" :open="editingPeople" @click="e=>e.stopPropagation()">
        <form @submit="e=>e.preventDefault()"><fieldset>
            <legend><h2>Edit participants</h2></legend>
            <section>
                <header class="secHeading"><h3>Cohosts</h3></header>
                <vselect :options="allSansHost" v-model="cohosters" multiple />
            </section>
            <section>
                <header class="secHeading flex"><h3>Players</h3><button class="submitter" @click="pushPlayer"><em>&#xFF0B; Add</em></button></header>
                <ul class="players nopad">
                    <li v-for="player,i in players.filter(p=>p.name!==null)">
                        <button @click="e=>removePlayer(e,i)" title="Remove player" aria-label="Remove player" class="rembtn">
                            <svg viewBox="0 0 24 24" height="1rem" width="1rem" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12L17 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle> </g></svg>
                            <!--
                                Ananthanath A X Kalaiism
                                https://www.svgrepo.com/svg/502809/remove-circle
                            -->
                        </button>
                        <button class="rembtn" title="Turn into NPC" aria-label="Turn into NPC" @click="e=>makeNPC(e,i)">
                            <svg viewBox="0 0 24 24" height="1rem" width="1rem" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0002 14C6.99016 14 2.91016 17.36 2.91016 21.5C2.91016 21.78 3.13016 22 3.41016 22H20.5902C20.8702 22 21.0902 21.78 21.0902 21.5C21.0902 17.36 17.0102 14 12.0002 14Z" fill="#292D32"></path> <path d="M15.71 3.66C14.81 2.64 13.47 2 12 2C10.6 2 9.32 2.57 8.41 3.51C7.54 4.41 7 5.65 7 7C7 7.94 7.26 8.82 7.73 9.57C7.98 10 8.3 10.39 8.68 10.71C9.55 11.51 10.71 12 12 12C13.83 12 15.41 11.02 16.28 9.57C16.54 9.14 16.74 8.66 16.85 8.16C16.95 7.79 17 7.4 17 7C17 5.72 16.51 4.55 15.71 3.66ZM13.87 7.92H10.13C9.61 7.92 9.19 7.5 9.19 6.98C9.19 6.46 9.61 6.04 10.13 6.04H13.87C14.39 6.04 14.81 6.46 14.81 6.98C14.81 7.5 14.39 7.92 13.87 7.92Z" fill="#292D32"></path> </g></svg>
                            <!--
                                Iconsax
                                https://www.svgrepo.com/svg/495810/user-minus
                                Under the MIT license.
                            -->
                        </button>
                        <vselect :options="(player.player ?? false) ? allSansCHostsAndPlayers.concat(player.player) : allSansCHostsAndPlayers" v-model="player.player" /> as <ShyEditable v-model="player.name" />
                    </li>
                </ul>
            </section>
            <section>
                <header class="secHeading flex"><h3>NPCs</h3><button class="submitter" @click="pushNPC"><em>&#xFF0B; Add</em></button></header>
                <ul class="npcs">
                    <li v-for="npc,i in nonplayables.filter(p=>p.name!==null)">
                        <button @click="e=>removeNPC(e,i)" title="Remove NPC" aria-label="Remove NPC" class="rembtn">
                            <svg viewBox="0 0 24 24" height="1rem" width="1rem" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12L17 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="12" cy="12" r="9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle> </g></svg>
                            <!--
                                Ananthanath A X Kalaiism
                                https://www.svgrepo.com/svg/502809/remove-circle
                            -->
                        </button>
                        <button class="rembtn" title="Turn into played country" aria-label="Turn into played country" @click="(e)=>makePlayer(e,i)">
                            <svg viewBox="0 0 24 24" height="1rem" width="1rem" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="#292D32"></path> <path d="M17.0809 14.1489C14.2909 12.2889 9.74094 12.2889 6.93094 14.1489C5.66094 14.9989 4.96094 16.1489 4.96094 17.3789C4.96094 18.6089 5.66094 19.7489 6.92094 20.5889C8.32094 21.5289 10.1609 21.9989 12.0009 21.9989C13.8409 21.9989 15.6809 21.5289 17.0809 20.5889C18.3409 19.7389 19.0409 18.5989 19.0409 17.3589C19.0309 16.1289 18.3409 14.9889 17.0809 14.1489ZM14.0009 18.1289H12.7509V19.3789C12.7509 19.7889 12.4109 20.1289 12.0009 20.1289C11.5909 20.1289 11.2509 19.7889 11.2509 19.3789V18.1289H10.0009C9.59094 18.1289 9.25094 17.7889 9.25094 17.3789C9.25094 16.9689 9.59094 16.6289 10.0009 16.6289H11.2509V15.3789C11.2509 14.9689 11.5909 14.6289 12.0009 14.6289C12.4109 14.6289 12.7509 14.9689 12.7509 15.3789V16.6289H14.0009C14.4109 16.6289 14.7509 16.9689 14.7509 17.3789C14.7509 17.7889 14.4109 18.1289 14.0009 18.1289Z" fill="#292D32"></path> </g></svg>
                        </button>
                        <!--
                            Iconsax
                            https://www.svgrepo.com/svg/495591/profile-add
                            Under the MIT license.
                        -->
                        <ShyEditable v-model="npc.name" />
                    </li>
                </ul>
            </section>
            <section class="flex spacearound">
                <button :class="['submitter', bthUpd ? 'breathing' : '']" @click="sendNewBoPData">
                    Update!
                </button>
                <button :class="['oldsilver', bthUpd ? 'breathing' : '']" @click="closePeopleEditor">
                    Close
                </button>
            </section>
        </fieldset></form>
    </dialog>
</template>
<style scoped>
    h2, h3 {
        margin: 0;
        padding: 0;
    }
    li {
        list-style: none;
    }
    header > * {
        display: inline-block;
    }
    .peopleEditor button:not(.rembtn) {
        padding: 0.2rem 1rem;
    }
    .dt .peopleEditor button {
        padding: calc(0.2rem - 1px) calc(1rem - 1px);
    }
    .peopleEditor section:not(:first-of-type) {
        margin-top: 0.6rem;
    }
    .secHeading button {
        margin: 0 0.6rem 0 auto;
    }
    dialog, dialog * {
        transition: var(--trchroma);
    }
    .rembtn {
        margin: 0 0.6rem 0 0.3rem;
        padding: 0;
        background-color: transparent;
    }
    .peopleEditor {
        position: fixed;
        z-index: 9999;
        top: 0;
        bottom: 0;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>