<script setup>
	import { bopData, lt } from "../../stores/bopstore";
	import { fileget, finishedFirstFetch, lastIsProcessing, playerNumber } from "../../assets/loadTrack";
	import { watch, ref, computed } from "vue";
	import RenderPanel from "./RenderPanel.vue";
	import RenderEditable from "./RenderEditable.vue";
	import HistoryLine from "./HistoryLine.vue";
	import { useRoute } from "vue-router";

	const props = defineProps(["type", "turn", "d", "strip", "doubleBind"]), route = useRoute();;
	const panelGet = ref("[i]loading...[/i]"),
		rw = computed(()=>route.params.claim != undefined && route.params.turn == undefined && !lastIsProcessing.value),
		selectedTurn = ref(route.params.turn || bopData.latestTurn || props.turn || -1),
		shy = computed(()=>!props.d);
	defineEmits(["turn"]);
	watch(
		() => finishedFirstFetch.value,
		(newFlag, oldFlag) => {
			if (props.doubleBind === true && playerNumber.value==-1) return;
			fileget(route.params.id, route.params.turn || bopData.latestTurn, route.params.claim, props.type).then((t) => panelGet.value = t);
			selectedTurn.value = bopData.latestTurn;
			watch(() => selectedTurn.value, (nv, ov) => {
				if (finishedFirstFetch.value === true) fileget(route.params.id, selectedTurn.value, route.params.claim, props.type).then((t) => panelGet.value = t)
			});
		});
	watch(
			() => bopData.latestTurn,
			(newParams, oldParams) => {
				// slight hack. i'm probably too locked into this to notice where/why the thing's not being passed. oh well
				selectedTurn.value = bopData.latestTurn;
			});
	watch(() => playerNumber.value, (nv, ov) => props.doubleBind === true ? fileget(route.params.id, selectedTurn.value, route.params.claim, props.type).then((t) => panelGet.value = t) : false);
</script>

<template>
	<h2>
		{{ { C: "Country Card", R: "Report", O: "Orders" }[type] }}
		<span :class="['disp', props.d ? 'up' : 'down']"><svg width="1em" height="1em" viewBox="0 0 100 100"
				@click="$emit('turn')">
				<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
					:stroke="lt ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)'" stroke-width="1em"
					fill="transparent" />
			</svg></span>
	</h2>
	<HistoryLine v-if="props.strip!==true" :st="selectedTurn" @selTurn="n=>selectedTurn=n" />
	<slide-up-down :active="!shy" :duration="400" tag="article">
		<RenderPanel v-if="!rw" :file="panelGet" />
		<RenderEditable v-if="rw" :file="panelGet" />
	</slide-up-down>
</template>

<style scoped>
	h2 {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: .375em;
		padding-right: 2.5rem;
	}
	h2 .disp {
		margin-left: auto;
		rotate: 0deg;
		transition: rotate 0.2s ease-in-out;
		&.down {
			rotate: 180deg;
			transition: rotate 0.2s ease-in-out;
		}
	}
	svg {
		margin-top: 0.4em;
	}
	article {
		padding: 0 3em 0 1.15em;
	}
</style>

<script></script>
