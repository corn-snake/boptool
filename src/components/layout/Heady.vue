<script setup>
    import { ref } from 'vue';
	import { isAuth, killLogin, usr } from "../../stores/authStore.js";
	import Texty from "./../primitives/Texty.vue";
	import Imagey from "./../primitives/Imagey.vue";
	import { compBop } from "../../stores/bopstore.js";
	const props = defineProps(["small"]);
	const buttonBreathing = ref(false),
	breathe = ()=>buttonBreathing.value = true,
	gasp = ()=>buttonBreathing.value = false;
</script>
<template>
	<header class="flex fullwidth burntivory fwshadow">
		<button
			class="menuButtonWrap nobg mediumicon nopad h-fit"
			@click="
				(e) => {
					e.stopPropagation();
					$emit('hideShow');
				}
			"
		>
			<i class="mdi mdi-menu"></i>
		</button>
		<span class="bopname" v-if="props.small && compBop.title.length > 0">
		    {{ compBop.title }}
		</span>
		<div class="user">
			<Imagey v-show="usr.pic.length > 0" :reffed="usr.pic" class="userpic" />
			<div class="username">{{ usr.name }}</div>
		</div>
		<button
			id="logout"
			:class="['submitter', 'inp-noout', buttonBreathing ? 'breathing' : '', { ded: !isAuth }]"
			@click="
				(e) => {
					e.preventDefault();
					$emit('loading');
					breathe();
					killLogin(() => {
					    gasp();
					    $emit('loaded');
					});
				}
			"
		>
			{{ buttonBreathing ? "Wait..." : "Sign Out" }}
		</button>
	</header>
</template>
<style scoped>
	header {
	    position: fixed;
		height: var(--magicmissile);
		padding: 0 1rem;
		margin-bottom: 12px;
		display: flex;
		flex-direction: row;
		align-items: center;
		z-index: 3;
		top: 0;
	}
	.userpic {
		max-height: calc(var(--magicmissile) - 1rem);
		object-fit: contain;
		margin-right: 1.2rem;
	}
	button,
	button:hover {
		margin-left: 0.2rem;
		border: none;
	}
	.menuButtonWrap + .user {
	    margin-left: auto;
	}
	.user {
		margin-right: 3rem;
		display: flex;
		align-items: center;
	}
	#logout {
		transition: opacity 0.2s ease-in, var(--trbg);
	}
	#logout.ded {
		opacity: 0;
	}
	@media (max-width: 600px) {
    	header {
            width: calc(100% - 2rem);
        }
	}
	@media (min-width: 601px) {
	    header {
			width: calc(81.3% - 2rem);
			transition: var(--trcolor), var(--trbg), width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		}
	    .main.left header {
			width: calc(100% - 2rem);
  		}
	}
	.bopname {
    	margin-left: auto;
        margin-right: auto;
        font-weight: bold;
        font-size: 1.2rem;
        font-style: italic;
        &::before, &::after {
            content: "-";
            margin: 0 1rem;
        }
	}
	:not(.dt) .bopname {
	    color: #57300a;
	}
	.dt .bopname {
	    filter: invert(100%);
	}
</style>
<style></style>
<script></script>
