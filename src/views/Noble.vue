<script setup>
	import { watch, reactive, computed, ref } from "vue";
	import { boppise, lastIsProcessing, finishedFirstFetch, getPlayers, list, selectedCountry } from "../assets/loadTrack.js";
	import { compBop, bopData, players } from "../stores/bopstore.js";
	import HistoryLine from "../components/atoms/HistoryLine.vue";
	import GenericLine from "../components/atoms/GenericLine.vue";
	import { useRoute } from "vue-router";
	import CountryCollection from "../components/mols/CountryCollection.vue";

	const route = useRoute();

	const rw = computed(()=>(route.params.turn == bopData.latestTurn && lastIsProcessing.value)||route.params.turn==undefined),
		selectedTurn = ref(-1);

	boppise(route.params.id).then((r) => {
		compBop.history = JSON.parse(r.hist);
		compBop.turn = [...Object.keys(compBop.history)].pop();
		bopData.latestTurn = parseInt(compBop.turn);
		finishedFirstFetch.value = true;
		lastIsProcessing.value = r.lastIsProcessing;
		selectedCountry.value = "";
		return r;
	});
	watch(
		() => route.params,
		(newId, oldId) => {
			boppise(route.params.id).then((r) => {
				compBop.history = JSON.parse(r.hist);
				compBop.turn = [...Object.keys(compBop.history)].pop();
				bopData.latestTurn = parseInt(compBop.turn);
				lastIsProcessing.value = r.lastIsProcessing;
				return r;
			}).then(r => {
				getPlayers(route.params.id, compBop.turn, list[route.params.claim]).then(p => players.value = p);
			}).then(() => selectedTurn.value = bopData.latestTurn);
		}
	);
	watch(
		()=>selectedTurn.value,
		(nv, ov)=>{
			compBop.turn = selectedTurn.value;
			getPlayers(route.params.id, compBop.turn, list[route.params.claim]).then(p => players.value = p);
		}
	);
	watch(
		() => finishedFirstFetch.value,
		(newFlag, oldFlag) => {
			selectedTurn.value = bopData.latestTurn;
		});
	// ["si", "array", "pronomen", "spacing", "rtl", "ccolor", "vertical"]
</script>
<template>
	<HistoryLine :st="selectedTurn" @selTurn="n=>selectedTurn=n" />
	<div class="sideselect">
		<GenericLine :array="players" :si="selectedCountry" :vertical="true" :rtl="true" @selItem="p=>selectedCountry=p"
			class="cl fwn" />
		<CountryCollection :strip="true" class="cc" :bindToPlayer="true" />
	</div>
</template>
<style scoped>
	.sideselect {
		display: flex;
		.cl {
			justify-content: flex-start;
			padding-top: 1.5em;
			font-style: italic;
			padding-right: 1.5em;
			min-width: 8.5em;
			max-width: 8.5em;
		}
		.cc {
			flex-grow: 1;
		}
	}
</style>
