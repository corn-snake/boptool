<script setup>
	import { boppeList } from "../../stores/authStore.js";
	import { bopData, compBop } from "../../stores/bopstore.js";
	import { RouterLink } from "vue-router";

	const bopReset = (bn=-1, cn = 0) =>{
        bopData.player = -1;
        bopData.bop = bn;
        bopData.turn = -1;
        bopData.claim = cn;
	}
</script>

<template>
    <div class="allbops">
    	<div class="bopcontainer hostedBoPs" v-show="boppeList.hosts.length > 0">
    		<span class="title hosting">Hosting:</span>
    		<RouterLink
    			class="bop"
    			v-for="item in boppeList.hosts"
    			:to="`/bop/bigMod/${item[0]}`"
    			@click.native="() => bopReset(item[0],2)"
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
    			@click.native="() => bopReset(item[0],1)"
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
    			@click.native="() => bopReset(item[0])"
    		>
    			<span>
    				{{ item[1] }}
    			</span>
    		</RouterLink>
    	</div>
    </div>
</template>

<style scoped>
    .sidebar .allbops {
        overflow-y: scroll;
        flex-wrap: nowrap;
    }
	.bopcontainer {
	    display: flex;
        flex-direction: column;
        width: calc(100% - 2rem);
		padding: 1rem;
	}
	.bop {
		font-size: 13px;
		margin: 0.5rem 0 0 1rem;
		position: relative;
		padding: 0.4rem 0;
	}
	.bop:first-of-type {
		padding-top: 0.5rem;
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
	.title {
	    font-weight: 450;
	}
	.dt .subtitle {
	    color: rgba(0.8,0.8,1,0.6)
	}
	@media (prefers-color-scheme: dark) {
		.bop::before {
			background-color: #85edff;
		}
	}
</style>
