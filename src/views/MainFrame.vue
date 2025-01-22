<script setup>
	import { watch, reactive, ref } from "vue";
	import { boppise, finishedFirstFetch, lastIsProcessing } from "../assets/loadTrack.js";
	import { compBop, bopData } from "../stores/bopstore.js";
	import { useRoute } from "vue-router";
	import CountryCollection from "../components/mols/CountryCollection.vue";

	const route = useRoute();

	boppise(route.params.id).then((r) => {
		compBop.history = JSON.parse(r.hist);
		compBop.turn = [...Object.keys(compBop.history)].pop();
		bopData.latestTurn = parseInt(compBop.turn);
		lastIsProcessing.value = r.lastIsProcessing;
		finishedFirstFetch.value = true;
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
			});
		}
	);
</script>
<template>
	<div>
		<CountryCollection />
	</div>
</template>
<script></script>
<style></style>
