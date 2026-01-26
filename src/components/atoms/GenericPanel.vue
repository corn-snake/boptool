<script setup>
	import { bopData, lt } from "../../stores/bopstore";
	import { fileget_new, lastIsProcessing } from "../../lib/loadTrack";
	import { watch, ref, computed, reactive } from "vue";
	import RenderPanel from "./RenderPanel.vue";
	import RenderEditable from "./RenderEditable.vue";
	import HistoryLine from "./HistoryLine.vue";
	import { useRoute } from "vue-router";

	const props = defineProps(["type", "d", "strip", "doubleBind"]), route = useRoute();
	const localTurn = ref(-1);
	const panelGet = ref("[i]loading...[/i]"),
		rw = computed(()=>route.params.claim != undefined && route.params.turn == undefined && !lastIsProcessing.value),
		refresh = ()=>fileget_new(route.params.id, props.strip === true ? bopData.turn : localTurn.value, bopData.claim, bopData.player, props.type).then((t) => panelGet.value = t);
	defineEmits(["turn"]);
	watch(
        bopData,
		(n,o) => {
            panelGet.value = "[i]loading...[/i]";
			if (props.doubleBind === true && (bopData.player==-1 || bopData.turn==-1))
			    return panelGet.value = `Select a ${bopData.turn >= 0 ? "player" : "turn"} from the list.`;
            if (props.strip !== true) return localTurn.value = bopData.turn;
			refresh();
		},{deep: true});
	watch(
	    localTurn,
		(n,o) => {
		    panelGet.value = "[i]loading...[/i]";
		    if (localTurn.value !== -1) return refresh()
		}
	)
</script>

<template>
	<h2>
		{{ { C: "Country Card", R: "Report", O: "Orders" }[type] }}
		<span :class="['disp', props.d ? '' : 'down']"><svg width="1em" height="1em" viewBox="0 0 100 100"
				@click="$emit('turn')">
				<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
					:stroke="lt ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)'" stroke-width="1em"
					fill="transparent" />
			</svg></span>
	</h2>
	<HistoryLine v-if="props.strip!==true" :st="localTurn" @selTurn="n=>props.strip===true ? bopData.turn=n : localTurn = n" />
	<slide-up-down :active="props.d" :duration="600">
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
		transition: rotate 0.6s ease-in-out;
		&.down {
			rotate: 180deg;
			transition: rotate 0.6s ease-in-out;
		}
	}
	article {
		padding: 0 3em 0 1.15em;
	}
	slide-up-down {
	    transition-timing-function: ease-in-out;
	}
</style>

<script></script>
