<script setup>
	import { bopData, lt, lastTurn } from "../../stores/bopstore";
	import { fileget, saveFileLocal, saveFileRemote, saveLock, remoteSaveLock } from "../../lib/loadTrack";
	import { watch, ref, computed, reactive } from "vue";
	import RenderPanel from "./RenderPanel.vue";
	import RenderEditable from "./RenderEditable.vue";
	import HistoryLine from "./HistoryLine.vue";
	import { useRoute } from "vue-router";

	const props = defineProps(["type", "d", "strip", "doubleBind"]), route = useRoute();
	const localTurn = ref(-1);
	const panelGet = ref("[i]loading...[/i]"),
		rw = computed(()=>{
		    if (bopData.claim > 0 && bopData.lastIsProcessing === true && props.type !== "O" && localTurn.value === lastTurn.value)
				return true;
			if (bopData.claim <= 0 && bopData.lastIsProcessing === false && props.type === "O" && localTurn.value === lastTurn.value)
			    return true;
			return false;
		}),

		fetchTurn = computed(()=>{
    		if (bopData.lastIsProcessing === true && bopData.claim > 0 && props.type === "O")
                return localTurn.value - 1;
            return localTurn.value;
		}),
		refresh = ()=>fileget(route.params.id, fetchTurn.value, bopData.claim, bopData.player, props.type).then((t) => panelGet.value = t);
	defineEmits(["turn"]);
	watch(
        bopData,
		(n,o) => {
            panelGet.value = "[i]loading...[/i]";
			if (props.doubleBind === true && (bopData.player==-1 || bopData.turn==-1))
			    return panelGet.value = `Select a ${bopData.turn >= 0 ? "player" : "turn"} from the list.`;
            localTurn.value = bopData.turn;
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
	<h2
	@click="$emit('turn')">
		{{ { C: "Country Card", R: "Report", O: "Orders" }[props.type] }}
		<span :class="['disp', props.d ? '' : 'down']"><svg width="1em" height="1em" viewBox="0 0 100 100">
				<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
					:stroke="lt ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)'" stroke-width="1em"
					fill="transparent" />
			</svg></span>
	</h2>
	<slide-up-down :active="props.d" :duration="600">
	    <HistoryLine v-if="props.strip!==true" :st="localTurn" @selTurn="n=>localTurn = n" />
    	<RenderPanel v-if="!rw" :file="panelGet" :hostOrder="props.type === 'O' && bopData.claim > 0" :pastOrder="props.type === 'O' && bopData.claim <= 0 && localTurn.value !== lastTurn" />
    	<RenderEditable v-if="rw" :file="panelGet" @edit="e=>saveFileLocal(bopData.bop, localTurn, bopData.player, props.type)(e)" />
        <nav class="slideBackUp">
            <button v-if="rw" :class="['remoteSave', 'submitter', saveLock > 0 ? 'ded' : '', remoteSaveLock > 0 ? 'breathing' : '']" @click="()=>saveFileRemote(bopData.bop, localTurn, bopData.player, props.type, bopData.claim)">
                {{ remoteSaveLock > 0 ? "Wait..." : "Upload" }}
            </button>
            <small
         			@click="$emit('turn')"><em>Close</em>&nbsp;<span :class="['disp', props.d ? '' : 'down']"><svg width="1em" height="1em" viewBox="0 0 100 100">
    			<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
    				:stroke="lt ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)'" stroke-width="1em"
    				fill="transparent" />
    		</svg></span></small></nav>
	</slide-up-down>
</template>

<style scoped>
	h2 {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: .375rem;
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
		padding: 0 3rem 0 1.15rem;
	}
	slide-up-down {
	    transition-timing-function: ease-in-out;
	}
	.slideBackUp {
	    display: flex;
		padding-right: 2.5rem;
		margin-top: 0.4rem;
	}
	.slideBackUp:has(.remoteSave) {
    	justify-content: space-around;
    	align-items: center;
	}
	.slideBackUp:not(:has(.remoteSave)) small {
	    margin-left: auto;
	}
	.remoteSave {
	    padding: 0.5rem 1rem;
	}
</style>

<script></script>
