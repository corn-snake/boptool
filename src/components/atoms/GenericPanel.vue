<script setup>
	import { bopData, lt, players, compBop } from "../../stores/bopstore.js";
	import { fileget, saveFileLocal, saveFileRemote, saveLock, remoteSaveLock, getPlayers, list, finishedFirstFetch, playerGetLock } from "../../lib/loadTrack.js";
	import { watch, ref, computed } from "vue";
	import RenderPanel from "./RenderPanel.vue";
	import RenderEditable from "./RenderEditable.vue";
	import HistoryLine from "./HistoryLine.vue";
	import { useRoute } from "vue-router";

	const props = defineProps(["type", "d", "strip", "doubleBind"]), route = useRoute();
	const localTurn = ref(-1);
	const panelGet = ref("[i]loading...[/i]"),
	    errored = ref(false),
		rw = computed(()=>{
            if (errored.value === true) return false;
		    if (bopData.claim > 0 && bopData.lastIsProcessing === true && props.type !== "O" && localTurn.value === compBop.history.at(-1))
				return true;
			if (bopData.claim <= 0 && bopData.lastIsProcessing === false && props.type === "O" && finishedFirstFetch.value === true && localTurn.value === compBop.history.at(-1).number)
			    return true;
			return false;
		}),

		fetchTurn = computed(()=>{
    		if (bopData.lastIsProcessing === true && bopData.claim > 0 && props.type === "O" && localTurn.value === compBop.history.at(-1))
                return localTurn.value - 1;
            return localTurn.value;
		}),
		refresh = ()=>fileget(route.params.id, fetchTurn.value, bopData.claim, bopData.player, props.type).then((t) => panelGet.value = t).catch(e=>{
            errored.value = true;
            panelGet.value = "something very bad happened. [b]fuck![/b]";
		});
	defineEmits(["turn"]);
    watch(() => bopData.turn, (n, o) => {
        if (props.doubleBind === true && bopData.claim > 0 && n !== undefined && n !== -1 && playerGetLock.value === false) {
            playerGetLock.value = true;
            getPlayers(route.params.id, bopData.turn, list[route.params.claim]).then(({pcs, npcs}) => {
                if (bopData.player >= 0) {
                    const plyr = players.value.at(bopData.player).player;
               	    players.value = pcs;
                    if (players.value.findIndex(p=>p.player === plyr) < 0)
                        return bopData.player = -1;
                    else
                        return bopData.player = players.value.findIndex(p=>p.player === plyr);
                }
                localTurn.value = n;
                playerGetLock.value = false;
            })
        }
    });
	watch(
        ()=>compBop.history.at(-1),
		(n,o) => {
            if (n === undefined) return;
            if (bopData.claim > 0 && n !== localTurn.value)
                localTurn.value = n;
    		else if (n.number !== localTurn.value)
                localTurn.value = n.number;
		});
    watch(()=>bopData.player, (n, o) => {
  		if ((props.doubleBind === true && n < 0) || localTurn.value < 0)
            return panelGet.value = `Select a ${localTurn >= 0 ? "player" : "turn"} from the list.`;
        if (n !== -1 && localTurn.value !== -1 && props.doubleBind === true) {
            panelGet.value = "[i]loading...[/i]";
            return refresh();
        }
    });
    watch(
        () => localTurn.value,
        (n, o) => {
            if ((props.doubleBind === true && bopData.player < 0) || n < 0 || n === undefined)
                return panelGet.value = `Select a ${n >= 0 ? "player" : "turn"} from the list.`;
            if (n!== undefined && n !== -1) {
                panelGet.value = "[i]loading...[/i]";
                return refresh()
            };
        }
    );
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
    	<RenderPanel v-if="!rw" :file="panelGet" :hostOrder="props.type === 'O' && bopData.claim > 0" :pastOrder="props.type === 'O' && bopData.claim <= 0 && finishedFirstFetch && compBop.history.at(-1) !== undefined && localTurn !== compBop.history.at(-1).number" />
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
