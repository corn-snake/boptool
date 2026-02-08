<script setup>
	import { watch, ref, onMounted, onUnmounted } from "vue";
	import { boppise, getPlayers, list, playerGetLock } from "../lib/loadTrack.js";
	import { compBop, players, bopData } from "../stores/bopstore.js";
	import { boppeList } from "../stores/authStore.js";
	import HistoryLine from "../components/atoms/HistoryLine.vue";
	import GenericLine from "../components/atoms/GenericLine.vue";
	import { useRoute } from "vue-router";
	import CountryCollection from "../components/mols/CountryCollection.vue";

	defineOptions({
        inheritAttrs: false
    })

	const route = useRoute(),
    plyrstrs = ref([]);

	compBop.title = "Loading...";
	bopData.claim = list[route.params.claim];
	boppise(route.params.id).then((r) => {
		compBop.history = r.hist;
		bopData.bop = parseInt(route.params.id);
		compBop.title = boppeList.names[bopData.bop];
		bopData.lastIsProcessing = r.lastIsProcessing;
		bopData.turn = compBop.history.at(-1);
		playerGetLock.value = true;
		return r;
	}).then(r=> getPlayers(route.params.id, bopData.turn, list[route.params.claim])).then(({pcs, npcs}) => {
   	    players.value = pcs;
        playerGetLock.value = false;
    });
	watch(
		() => route.params,
		(newId, oldId) => {
		    compBop.title = "Loading...";
			bopData.claim = list[route.params.claim];
    		boppise(route.params.id).then((r) => {
                compBop.history = r.hist;
                bopData.bop = parseInt(route.params.id);
                compBop.title = boppeList.names[bopData.bop];
                bopData.lastIsProcessing = r.lastIsProcessing;
                bopData.turn = compBop.history.at(-1);
                bopData.player = -1;
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
	<div :class="wwidth >= 600 ? 'sideselect' : 'withtopselect'">
		<GenericLine :array="plyrstrs" :si="bopData.player" :vertical="wwidth >= 600 ? true : false" :rtl="true" @selItem="p =>bopData.player=p.number" :sin="true" :nopad="wwidth >= 600 ? false : true"
			class="cl fwn" />
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
