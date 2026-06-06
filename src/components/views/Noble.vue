<script setup>
	import { watch, ref, onMounted, onUnmounted } from "vue";
	import { boppise } from "../../lib/runtimeActs.js";
	import { compBop, players, bopData, nonplayables, cohosters } from "../../stores/bopstore.js";
	import { boppeList, list } from "../../stores/authStore.js";
	import HistoryLine from "../atoms/HistoryLine.vue";
	import GenericLine from "../atoms/GenericLine.vue";
	import { useRoute } from "vue-router";
	import CountryCollection from "../mols/CountryCollection.vue";
	import EditPeople from "../atoms/EditPeople.vue";
	import HistoryTable from "../atoms/HistoryTable.vue";
import { loadingData } from "../../stores/bellsandwhistles.js";

	defineOptions({
        inheritAttrs: false
    })

	const route = useRoute(),
    plyrstrs = ref([]);

	compBop.title = "Loading...";
	bopData.country = "";
	bopData.claim = list[route.params.claim];
	compBop.history = [];
	compBop.validated = [];
	compBop.completed = [];
	compBop.progress = {};
    players.value = [];
    nonplayables.value = [];
    cohosters.value = [];
    loadingData.value = true;
	boppise(route.params.id).then((r) => {
		compBop.history = r.hist;
		bopData.bop = parseInt(route.params.id);
		compBop.title = boppeList.names[bopData.bop];
		bopData.lastIsProcessing = r.lastIsProcessing;
        bopData.turn = compBop.history.at(-1);
        compBop.validated = r.validated;
        compBop.completed = r.completed;
        compBop.progress = r.progressLatest;
        loadingData.value = false;
		return r;
	});
	watch(
		() => route.params,
		(n, o) => {
		    compBop.title = "Loading...";
			bopData.country = "";
            bopData.claim = list[n.claim];
			compBop.history = [];
			compBop.validated = [];
            compBop.completed = [];
            compBop.progress = {};
            bopData.bop = -1;
            bopData.turn = -1;
            loadingData.value = true;
    		boppise(n.id).then((r) => {
                compBop.history = r.hist;
                bopData.bop = parseInt(n.id);
                compBop.title = boppeList.names[bopData.bop];
                bopData.lastIsProcessing = r.lastIsProcessing;
                bopData.turn = compBop.history.at(-1);
                bopData.player = -1;
                compBop.validated = r.validated;
                compBop.completed = r.completed;
                compBop.progress = r.progressLatest;
                loadingData.value = false;
            });
		}
	);
	watch(() => players.value, n => {
	    plyrstrs.value = n.map(({ player, name }) => `${player} (${name})`)
	});
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
		<GenericLine :array="plyrstrs" :si="bopData.player" :vertical="wwidth >= 600 ? true : false" :rtl="true" @selItem="p => { bopData.player = p.number;  bopData.country = players[p.number].name}" :sin="true" :nopad="wwidth >= 600 ? false : true"
			class="cl fwn">
			<EditPeople v-if="bopData.claim === 2 && bopData.turn === compBop.history.at(-1)"/>
		</GenericLine>
		<!-- GenericLine :array="npcs" :si="bopData.npc" :vertical="wwidth >= 600 ? true : false" :rtl="true" @selItem="p =>bopData.player=p.number" :sin="true" :nopad="wwidth >= 600 ? false : true"
			class="cl fwn" /-->
		<CountryCollection :strip="true" class="cc" :bindToPlayer="true" />
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
