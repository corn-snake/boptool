<script setup>
	import { watch, computed, ref, onMounted, onUnmounted } from "vue";
	import { boppise, finishedFirstFetch, getPlayers, list } from "../lib/loadTrack.js";
	import { compBop, players, bopData } from "../stores/bopstore.js";
	import { boppeList } from "../stores/authStore.js";
	import HistoryLine from "../components/atoms/HistoryLine.vue";
	import GenericLine from "../components/atoms/GenericLine.vue";
	import { useRoute } from "vue-router";
	import CountryCollection from "../components/mols/CountryCollection.vue";

	defineOptions({
        inheritAttrs: false
    })

	const route = useRoute();

	const rw = computed(()=>(route.params.turn == Object.keys(compBop.history).at(-1) && bopData.lastIsProcessing)||route.params.turn==undefined);

	compBop.title = "Loading...";
	boppise(route.params.id).then((r) => {
		compBop.history = JSON.parse(r.hist);
		bopData.bop = parseInt(route.params.id);
		compBop.title = boppeList.names[bopData.bop];
		bopData.claim = Object.values(compBop.history).at(-1);
		finishedFirstFetch.value = true;
		bopData.lastIsProcessing = r.lastIsProcessing;
		bopData.turn = Object.keys(compBop.history).at(-1);
		return r;
	});
	watch(
		() => route.params,
		(newId, oldId) => {
		    compBop.title = "Loading...";
    		boppise(route.params.id).then((r) => {
                compBop.history = JSON.parse(r.hist);
                bopData.bop = parseInt(route.params.id);
                compBop.title = boppeList.names[bopData.bop];
                bopData.claim = Object.values(compBop.history).at(-1);
                bopData.lastIsProcessing = r.lastIsProcessing;
                bopData.turn = Object.keys(compBop.history).at(-1);
                return r;
            })
		}
	);
	watch(
		()=>bopData.turn,
		(nv, ov)=>{
			getPlayers(route.params.id, bopData.turn, list[route.params.claim]).then(p => players.value = p);
		}
	);
	const wwidth = ref(document.getElementById("app").offsetWidth),
	winChange = ()=>{
	    wwidth.value = document.getElementById("app").offsetWidth;
	};
	onMounted(()=>window.addEventListener('resize', winChange));
	onUnmounted(()=>window.removeEventListener('resize', winChange));
</script>
<template>
	<HistoryLine :st="bopData.turn" class="pt" @selItem="n=>bopData.turn = n" />
	<div :class="wwidth >= 600 ? 'sideselect' : 'withtopselect'">
		<GenericLine :array="players" :si="bopData.player" :vertical="wwidth >= 600 ? true : false" :rtl="true" @selItem="p=>bopData.player=p.number" :sin="true" :nopad="wwidth >= 600 ? false : true"
			class="cl fwn" />
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
