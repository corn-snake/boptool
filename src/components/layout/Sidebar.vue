<script setup>
	import BoPList from "./../mols/BoPList.vue";
	import ThemeToggle from "./../atoms/ThemeToggle.vue";
	import { RouterLink } from "vue-router";
	const props = defineProps(["logged", "lt"]);
	import { finishedFirstFetch } from "../../assets/loadTrack";
</script>
<template>
	<div class="sidebar fullwidth rel burntivory flex columnar">
		<RouterLink to="/" :class="['lonk', finishedFirstFetch ? 'off' : '']">
			<div :class="[!logged ? 'active' : '', 'returner']">
				<div class="title">BoP Tool v2.5</div>
				<div class="subtitle ovimp">*maniacal laughter</div>
			</div>
		</RouterLink>
		<BoPList />
		<a
			class="changer"
			@click="
				(e) => {
					e.stopPropagation();
					$emit('asknewpwd');
				}
			"
			v-if="!logged"
			><i>Change password</i>
		</a>
		<ThemeToggle :lt="lt" @noon="() => $emit('noon')" />
	</div>
</template>

<style scoped>
	* {
		transition: opacity 0.5s ease-out, var(--trcolor);
	}
	.sidebar {
		flex-shrink: 0;
		left: 0;
		border-right: 1px solid rgba(0, 0, 0, 0.12);
		z-index: 2;
		transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), var(--trbg);
		height: fit-content;
		min-height: 100dvh;
	}
	.returner {
		padding: 0.72em 1em;
	}
	.returner .title {
		font-weight: 500;
		font-size: 20px;
		margin-bottom: 2px;
	}
	.returner.active,
	.returner.active .title {
		color: var(--linkcolor);
	}
	.lonk {
		&.off {
			pointer-events: none;
		}
	}
	.sidebar > *:not(:last-child) {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: rgba(0, 0, 0, 0.15);
		transition: var(--trbg, --trcolor), border-bottom-color 0.2s ease-in;
	}
	.sidebar.dt > *:not(:last-child) {
		border-bottom-color: rgba(255, 255, 255, 0.15);
	}
	.sidebar > * {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}
	.returner::before {
		position: absolute;
		content: "";
		top: 0;
		left: 0;
		width: 100%;
		height: var(--magicmissile);
		background-color: currentColor;
		opacity: 0;
		transition: opacity 0.15s ease-out;
	}
	.returner:not(.active):hover::before {
		opacity: 0.04;
	}
	.returner.active::before {
		opacity: 0.12;
	}

	.sidebar.off {
		transform: translateX(-100%);
	}
	.changer {
		margin-top: auto;
		padding: 1em;
		padding-bottom: 0.7em;
		text-align: center;
	}
	.changer i {
		text-decoration: underline dashed;
	}

	@media (max-width: 500px) {
		.sidebar {
			max-width: 70%;
			position: absolute;
		}
	}
	@media (min-width: 501px) {
		.sidebar {
			max-width: 18.7%;
		}
	}
</style>
