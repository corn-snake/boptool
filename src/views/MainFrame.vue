<script setup>
	import { watch } from "vue";
	import { boppise } from "../lib/runtimeActs.js";
	import { compBop, bopData } from "../stores/bopstore.js";
	import { boppeList, finishedFirstFetch } from "../stores/authStore.js";
	import { useRoute } from "vue-router";
	import CountryCollection from "../components/mols/CountryCollection.vue";

	const route = useRoute();

    const tr = () => boppise(route.params.id, true).then(r=>{
        compBop.title = "Loading...";
        bopData.claim = 0;
        bopData.bop = parseInt(route.params.id);
        compBop.history = boppeList.plays.find(v => v[0] === bopData.bop).at(-1);
        compBop.title = `${boppeList.names[bopData.bop]} :: ${compBop.history.at(-1).name}`;
        bopData.lastIsProcessing = r;
        bopData.turn = boppeList.plays.find(v => v[0] === bopData.bop).at(-1).number;
        bopData.player = -1;
    });

    if (finishedFirstFetch.value === false) watch(() => finishedFirstFetch.value, tr); else tr();
	watch(() => route.params, tr);
</script>
<template>
	<div>
		<CountryCollection />
	</div>
</template>
<script></script>
<style></style>
