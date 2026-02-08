<script setup>
	import { boppeList, usr } from "../../stores/authStore.js";
	import { RouterLink } from "vue-router";
</script>

<template>
    <div class="allbops">
        <div v-if="usr.amdin === true" class="bopcontainer admincont">
            <RouterLink class="amdin title" to="/mat">
                <span>Admin panel</span>
            </RouterLink>
        </div>
    	<div class="bopcontainer hostedBoPs" v-show="boppeList.hosts.length > 0">
    		<span class="title hosting">Hosting:</span>
    		<RouterLink
    			class="bop"
    			v-for="item in boppeList.hosts"
    			:to="`/bop/bigMod/${item[0]}`"
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
	.admincont {
        padding: 0;
        margin-top: 0.8rem;
        align-self: center;
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
	.bop:not(.current):hover::after {
		opacity: 0.04;
	}
	.bop.current::after {
		opacity: 0.12;
	}
	.amdin {
        padding: 0.6rem 0;
        font-size: 0.9rem;
        font-weight: 450;
        border-radius: 4pt;
	}
	.amdin:not(.current):hover {
        background-color: color-mix(in srgb, currentColor 4%, transparent 96%);
	}
	.amdin.current {
	    background-color: color-mix(in srgb, currentColor 12%, transparent 88%);
	}
	.admincont + .bopcontainer {
        padding-top: 0.6rem;
	}
	.dt .bop::before {
		background-color: #85edff;
	}
	.title, .amdin {
	    font-weight: 450;
	}
	.dt .subtitle {
	    color: rgba(0.8,0.8,1,0.6)
	}
	.amdin {
        text-align: center;
	}
	@media (prefers-color-scheme: dark) {
		.bop::before {
			background-color: #85edff;
		}
	}
</style>
