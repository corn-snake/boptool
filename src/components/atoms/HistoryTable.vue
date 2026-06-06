<script setup>
    import { ref } from 'vue';
    import { players, compBop, nonplayables } from './../../stores/bopstore.js';
    import Imagey from "./../primitives/Imagey.vue";
    import PopOut from './../mols/PopOut.vue';
import { loadingData } from '../../stores/bellsandwhistles.js';

    const shown = ref(false),
        changeShow = () => shown.value = !shown.value;

    const progress = (pn, type) => {
        const a = compBop.progress[pn] ?? {};
        return `/pub${a[type] ? 'Y' : 'N'}.png`;
    },
        completed = (pn) => `/pub${compBop.validated.includes(pn) || compBop.completed.includes(pn) ? 'Y' : 'N'}.png`,
        validated = (pn) => `/pub${compBop.validated.includes(pn) ? 'Y' : 'N'}.png`;
</script>

<template>
    <h3 @click="changeShow" v-if="!loadingData">
		<i>Processing: Turn {{compBop.history.at(-1)}}</i>
		<span :class="['disp', shown ? '' : 'down']">
		    <svg width="1em" height="1em" viewBox="0 0 100 100">
				<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
				    :stroke="lt ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)'" stroke-width="1em"
					fill="transparent" />
			</svg>
		</span>
	</h3>
	<slide-up-down :active="shown" :duration="600" class="flex columnar">
	    <table>
			<thead>
			    <tr>
					<th rowspan="2">Country</th>
					<th rowspan="2">Player</th>
					<th colspan="2">CCs</th><th colspan="2">Reports</th>
					<th rowspan="2">Orders</th>
					<th rowspan="2">Complete</th>
					<th rowspan="2">Validated</th>
				</tr>
				<tr class="secondorder"><th>Old</th><th>New</th><th>Old</th><th>New</th></tr>
			</thead>
			<tbody>
    			<tr v-for="player of players.concat(nonplayables)">
                    <td>{{player.name}}</td>
                    <td :class="[(player.player ?? false) ? '' : 'npc']">{{player.player ?? 'NPC'}}</td>
                    <td><PopOut :turn="compBop.history.at(-2)" :player="player.number" type="C"><Imagey reffed="/popup.png"/></PopOut></td>
                    <td><PopOut :turn="compBop.history.at(-1)" :player="player.number" type="C"><Imagey :reffed="progress(player.number, 'C')"/></PopOut></td>
                    <td><PopOut :turn="compBop.history.at(-2)" :player="player.number" type="R"><Imagey reffed="/popup.png"/></PopOut></td>
                    <td><PopOut :turn="compBop.history.at(-1)" :player="player.number" type="R"><Imagey :reffed="progress(player.number, 'R')"/></PopOut></td>
                    <td><PopOut :turn="compBop.history.at(-2)" :player="player.number" type="O"><Imagey :reffed="progress(player.number, 'O')"/></PopOut></td>
                    <td><Imagey :reffed="completed(player.number)"/></td>
                    <td><Imagey :reffed="validated(player.number)"/></td>
    			</tr>
			</tbody>
		</table>
       <nav class="slideBackUp">
           <small
        			@click="changeShow"><em>Close</em>&nbsp;<span :class="['disp', shown ? '' : 'down']"><svg width="1em" height="1em" viewBox="0 0 100 100">
   			<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
   				:stroke="lt ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)'" stroke-width="1em"
   				fill="transparent" />
   		</svg></span></small></nav>
	</slide-up-down>
</template>

<style scoped>
    table, nav {
        margin-left: auto;
        margin-right: auto;
    }
    table {
        border-spacing: 0;
        background-color: var(--editcolor);
    }
    h3, tbody td:nth-child(n+2) {
        text-align: center;
    }
    td, th {
        border: 1px solid var(--linkcolor);
        border-collapse: collapse;
        padding: 0 0.5rem;
    }
    thead tr:first-child :is(td, th) {
        border-top: 2px dashed color-mix(in srgb, var(--linkcolor) 35%, var(--editcolor) 65%);
    }
    :is(td, th):is(:nth-child(n+2)), .secondorder th:first-child {
        border-left: none;
    }
    :is(td, th):first-child {
        border-left: 2px dashed color-mix(in srgb, var(--linkcolor) 35%, var(--editcolor) 65%);
    }
    :is(td,th):last-child {
        border-right: 2px dashed color-mix(in srgb, var(--linkcolor) 35%, var(--editcolor) 65%);
    }
    .secondorder :last-child {
        border-right: 1px solid var(--linkcolor);
    }
    tr :is(td, th), .secondorder th {
        border-bottom: none;
    }
    tbody tr:last-child :is(td, th) {
        border-bottom: 2px dashed color-mix(in srgb, var(--linkcolor) 35%, var(--editcolor) 65%);
    }
    td:first-child {
        padding-left: 0.2rem;
    }
    th:has(table) {
        padding: 0;
        border: none;
    }
    table th > table th {
        margin: 1px;
    }
    .npc {
        font-style: italic;
    }
</style>