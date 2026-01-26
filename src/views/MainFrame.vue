<script setup>
	import { watch, reactive, ref } from "vue";
	import { boppise, finishedFirstFetch, lastIsProcessing } from "../lib/loadTrack.js";
	import { compBop, bopData } from "../stores/bopstore.js";
	import { boppeList } from "../stores/authStore.js";
	import { useRoute } from "vue-router";
	import CountryCollection from "../components/mols/CountryCollection.vue";

	const route = useRoute();
	compBop.title = "Loading...";
	boppise(route.params.id).then((r) => {
		compBop.history = JSON.parse(r.hist);
        bopData.bop = parseInt(route.params.id);
        compBop.title = boppeList.names[bopData.bop];
		bopData.turn = Object.keys(compBop.history).at(-1);
		lastIsProcessing.value = r.lastIsProcessing;
		finishedFirstFetch.value = true;
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
				lastIsProcessing.value = r.lastIsProcessing;
				bopData.turn = Object.keys(compBop.history).at(-1);
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
