<script setup>
	import { isAuth, killLogin, usr } from "../../stores/authStore.js";
	import Texty from "./../primitives/Texty.vue";
	import Imagey from "./../primitives/Imagey.vue";
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
		<div class="user">
			<Imagey v-show="usr.pic.length > 0" :reffed="usr.pic" class="userpic" />
			<div class="username">{{ usr.name }}</div>
		</div>
		<button
			id="logout"
			:class="['submitter', 'inp-noout', { ded: !isAuth }]"
			@click="
				(e) => {
					e.preventDefault();
					$emit('loading');
					killLogin(() => $emit('loaded'));
				}
			"
		>
			Sign Out
		</button>
	</header>
</template>
<style scoped>
	header {
		width: calc(100% - 2em);
		height: var(--magicmissile);
		padding: 0 1em;
		margin-bottom: 12px;
		display: flex;
		flex-direction: row;
		align-items: center;
		transition: var(--trcolor), var(--trbg);
	}
	.userpic {
		max-height: calc(var(--magicmissile) - 1em);
		object-fit: contain;
		margin-right: 1.2em;
	}
	button,
	button:hover {
		margin-left: 0.2em;
		border: none;
	}
	.user {
		margin-left: auto;
		margin-right: 3em;
		display: flex;
		align-items: center;
	}
	#logout {
		transition: opacity 0.2s ease-in, var(--trbg);
	}
	#logout.ded {
		opacity: 0;
	}
</style>
<style></style>
<script></script>
