<script setup>
	import { watch, ref, onMounted, onUnmounted } from "vue";
	import { boppise, getPlayers } from "../../lib/runtimeActs.js";
	import { compBop, players, bopData, nonplayables, cohosters } from "../../stores/bopstore.js";
	import { boppeList, list } from "../../stores/authStore.js";
	import HistoryLine from "../atoms/HistoryLine.vue";
	import GenericLine from "../atoms/GenericLine.vue";
	import { useRoute } from "vue-router";
	import CountryCollection from "../mols/CountryCollection.vue";
	import EditPeople from "../atoms/EditPeople.vue";
	import HistoryTable from "../atoms/HistoryTable.vue";
	import { finishedFirstFetch, loadingData, playerGetLock } from "../../stores/bellsandwhistles.js";
	import CompletionButtons from "../atoms/CompletionButtons.vue";

	defineOptions({
        inheritAttrs: false
    })

	const route = useRoute();

    const rt = () => {
        getPlayers(route.params.id, bopData.turn, list[route.params.claim]).then(({ pcs, chosts, npcs }) => {
       	    players.value = pcs;
            nonplayables.value = npcs;
            cohosters.value = chosts?.filter(Boolean).filter(e=>e.length > 1) ?? [];
        }).finally(() => { loadingData.value = false; playerGetLock.value = false; })
    },
    tr = () => {
        loadingData.value = true;
       	playerGetLock.value = true;
    	compBop.title = "Loading...";
    	bopData.country = "";
    	bopData.claim = list[route.params.claim];
    	compBop.history = [];
    	compBop.validated = [];
    	compBop.completed = [];
    	compBop.progress = {};
        bopData.bop = -1;
        bopData.turn = -1;
        players.value = [];
        nonplayables.value = [];
        cohosters.value = [];
    	boppise(route.params.id).then((r) => {
    		compBop.history = r.hist;
    		bopData.bop = parseInt(route.params.id);
    		compBop.title = boppeList.names[bopData.bop];
    		bopData.lastIsProcessing = r.lastIsProcessing;
            bopData.turn = compBop.history.at(-1);
            bopData.player = -1;
            compBop.validated = r.validated;
            compBop.completed = r.completed;
            compBop.progress = r.progressLatest;
            rt()
    		return r;
        });
    };
	if (finishedFirstFetch.value === false) watch(() => finishedFirstFetch.value, tr); else tr();
	watch(
		() => route.params,
		tr
	);
	const wwidth = ref(document.getElementById("app").offsetWidth),
	winChange = ()=>{
	    wwidth.value = document.getElementById("app").offsetWidth;
	};
	onMounted(()=>window.addEventListener('resize', winChange));
	onUnmounted(()=>window.removeEventListener('resize', winChange));
</script>
<template>
	<HistoryLine :st="bopData.turn" class="pt" @selTurn="n=>bopData.turn = n" />
	<HistoryTable/>
	<div :class="wwidth >= 600 ? 'sideselect' : 'withtopselect'">
		<GenericLine :array="players.concat(nonplayables).map(({player, name})=>player ? `${player} (${name})` : `NPC: ${name}`)" :si="players.concat(nonplayables).findIndex(e=>e.number===bopData.player)" :vertical="wwidth >= 600 ? true : false" :rtl="true" @selItem="p => { bopData.player = players.concat(nonplayables)[p.number].number; bopData.country = players.concat(nonplayables)[p.number].name}" :sin="true" :nopad="wwidth >= 600 ? false : true"
			class="cl fwn">
			<EditPeople v-if="bopData.claim === 2 && bopData.turn === compBop.history.at(-1)"/>
		</GenericLine>
		<CountryCollection :strip="true" class="cc" :bindToPlayer="true">
		    <CompletionButtons v-if="!loadingData && bopData.claim > 0 && bopData.player > -1 && (bopData.turn < 0 || bopData.turn === compBop.history.at(-1))"/>
		</CountryCollection>
	</div>
</template>
<style scoped>
    .sideselect {
    	display: flex;
    	.cl {
    		justify-content: flex-start;
    		padding-top: 1.5rem;
    		font-style: italic;
    		padding-right: 1.5rem;
    		min-width: 8.5rem;
    		max-width: 8.5rem;
    	}
    	.cc {
    		flex-grow: 1;
    	}
    }
    .main > .pt {
        padding-top: 1rem
    }
    .main > .withtopselect {
        padding-top: 0.6rem
    }
</style>
