<script setup>
	import { boppeList } from "../../stores/authStore.js";
	import { bopData } from "../../stores/bopstore.js";
	import { RouterLink } from "vue-router";
</script>

<template>
	<div class="bopcontainer hostedBoPs" v-show="boppeList.hosts.length > 0">
		<span class="title hosting">Hosting:</span>
		<RouterLink
			class="bop"
			v-for="item in boppeList.hosts"
			:to="`/bop/bigMod/${item[0]}`"
			@click.native="
				() => {
					bopData.number = item[0];
					bopData.turn = item[3];
					bopData.latestTurn = item[3];
				}
			"
		>
			<span>
				{{ item[1] }}
			</span>
		</RouterLink>
	</div>
	<div class="bopcontainer cohostedBoPs" v-show="boppeList.chost.length > 0">
		<span class="subtitle co-hosting">Co-hosting: </span>
		<RouterLink
			class="bop"
			v-for="item in boppeList.chost"
			:to="`/bop/mod/${item[0]}`"
			@click.native="
				() => {
					bopData.number = item[0];
					bopData.turn = item[3];
					bopData.latestTurn = item[3];
				}
			"
		>
			<span>
				{{ item[1] }}
			</span>
		</RouterLink>
	</div>
	<div class="bopcontainer playedBoPs" v-show="boppeList.plays.length > 0">
		<span class="title playing">Playing in:</span>
		<RouterLink
			class="bop"
			v-for="item in boppeList.plays"
			:to="`/bop/${item[0]}`"
			@click.native="
				() => {
					bopData.number = item[0];
					bopData.turn = item[3];
					bopData.latestTurn = item[3];
				}
			"
		>
			<span>
				{{ item[1] }}
			</span>
		</RouterLink>
	</div>
</template>

<style>
	.bopcontainer {
		padding: 1em;
	}
	.bop {
		font-size: 13px;
		margin: 0.5em 0 0 1em;
		position: relative;
		padding: 0.4em 0;
	}
	.bop:first-of-type {
		padding-top: 0.5em;
	}
	.bop::after {
		position: absolute;
		content: "";
		display: inline-block;
		height: 100%;
		width: 110%;
		top: 0;
		left: -9%;
		background-color: currentColor;
		opacity: 0;
		transition: opacity 0.2s ease-out, var(--trbg);
		border-radius: 3pt;
	}
	.bop:not(.current):hover:after {
		opacity: 0.04;
	}
	.bop.current::after {
		opacity: 0.12;
	}
	.dt .bop::before {
		background-color: #85edff;
	}
	@media (prefers-color-scheme: dark) {
		.bop::before {
			background-color: #85edff;
		}
	}
</style>
