<script setup>
	import Sidebar from "./components/layout/Sidebar.vue";
	import Heady from "./components/layout/Heady.vue";
	import { ref } from "vue";
	import { load, makeLoad, unLoad } from "./assets/loadTrack.js";
	import { lt } from "./stores/bopstore.js";
	const overrides =
		parseInt(
			getComputedStyle(document.body)
				.getPropertyValue("width")
				.substring(
					0,
					getComputedStyle(document.body).getPropertyValue("width").length - 2
				)
		) < 501;
	const showSide = ref(overrides ? false : true),
		logged = ref(false),
		pwdDialog = ref(false);
	const showUnshow = () => (showSide.value = !showSide.value),
		pureHide = () => {
			if (overrides) showSide.value = false;
			if (pwdDialog.value) pwdDialogClose();
		},
		duskDawn = () => (lt.value = !lt.value),
		pwdDialogOpen = () => (pwdDialog.value = true),
		pwdDialogClose = () => (pwdDialog.value = false);
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		lt.value = false;
	}
</script>

<template>
	<Sidebar
		:logged="logged"
		:class="{ on: showSide, off: !showSide, dt: !lt }"
		:lt="lt"
		@toooogle="showUnshow"
		@noon="duskDawn"
		@loading="makeLoad"
		@loaded="unLoad"
		@asknewpwd="pwdDialogOpen"
		@click="pwdDialogClose"
	/>
	<main
		:class="[
			'main',
			'fullwidth',
			'rel',
			'oldsilver',
			{ dt: !lt, left: !showSide, hide: showSide && overrides, load: load },
		]"
		@click="pureHide"
	>
		<Heady @hideShow="showUnshow" @loading="makeLoad" @loaded="unLoad" />
		<router-view></router-view>
	</main>
	<dialog id="pwdReset" v-if="!logged" :open="pwdDialog">
		<form>
			<fieldset class="flex columnar">
				<legend>Password reset</legend>
				<label for="newPwd">Type in new password:&nbsp;</label
				><input type="password" name="newPwd" id="newPwd" />
				<label for="pwdConf">Confirm:&nbsp;</label
				><input type="password" name="pwdConf" id="pwdConf" />
				<button
					class="submitter"
					@click="
						(e) => {
							e.preventDefault();
							pwdDialogClose();
						}
					"
				>
					Submit
				</button>
			</fieldset>
		</form>
	</dialog>
</template>

<style scoped>
	.main {
		min-height: calc(100dvh - 12px);
		max-height: calc(100% - 12px);
		overflow-y: scroll;
	}
</style>
<style>
	:root {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		--magicmissile: calc(0.875rem + 22px + 1.44 * 20px);
		--linkcolor: #815127;
		--trcolor: color 0.2s ease-in;
		--trbg: background-color 0.2s ease-in;
	}
	html {
		font-size: 16px;
	}
	* * {
		transition: var(--trcolor, --trbg);
	}
	body {
		margin: 0;
		min-width: 100vw;
		min-height: 100dvh;
		position: absolute;
		top: 0;
		left: 0;
	}
	.flex {
		display: flex;
	}
	.flex.columnar {
		flex-direction: column;
	}
	.fullwidth {
		width: 100%;
	}
	.abs {
		position: absolute;
	}
	.rel {
		position: relative;
	}
	.nobg {
		background-color: initial;
	}
	.nopad {
		padding: 0;
	}
	.h-fit {
		height: fit-content;
	}
	.mediumicon {
		font-size: 1.5em;
	}
	.burntivory {
		background-color: #d9c9ad;
	}
	.dt.burntivory,
	.dt .burntivory {
		background-color: #1b263c;
	}
	.oldsilver,
	.simplesilver {
		background-color: #eae7e0;
	}
	.dt.oldsilver,
	.dt .oldsilver {
		background-color: #15181f;
	}
	.fwshadow {
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
			0 1px 10px 0 rgba(0, 0, 0, 0.12);
	}
	.title {
		font-family: Roboto;
		letter-spacing: 0.25px;
	}
	.subtitle {
		font-size: 0.875rem;
	}
	:not(.dt) .subtitle {
		color: rgba(0, 0, 0, 0.6);
	}
	.inp-noout:focus {
		outline: none;
	}
	.submitter {
		background-color: #815127;
	}
	:not(.dt) .submitter,
	.dt .submitter {
		color: #eae7e0;
	}
	:not(.dt) * {
		color: rgba(0, 0, 0, 0.87);
	}
	a {
		transition: var(--trbg, --trcolor), filter 0.2s ease-in;
	}
	a,
	a *:not(.ovimp),
	.linkcolor,
	.linkcolor * {
		color: var(--linkcolor) !important;
	}
	.dt a,
	.dt a :not(*),
	.dt .linkcolor,
	.dt .linkcolor :not(*) {
		filter: invert(100%) !important;
	}
	.dt * {
		color: rgba(255, 255, 255, 0.87);
	}
	.main {
		padding-bottom: 12px;
		z-index: 0;
		line-height: 1.5;
	}
	.main > :not(:first-child) {
		padding: 0 12px;
	}
	.main.hide button {
		pointer-events: none;
	}
	input {
		background-color: initial;
		border: none;
		font-size: 1rem;
	}
	button {
		transition: var(--trbg), var(--trcolor), border-color 0.25s, filter 0.2s ease-in;
	}
	button:hover {
		border-color: #9b9300;
	}
	.dt button:not(.ovbutton):hover {
		border-color: #646cff;
	}
	button.ded {
		pointer-events: none;
		filter: saturate(25%);
	}
	button.mid {
		/*filter: ;*/
	}
	a.current {
		pointer-events: none;
	}
	@media (prefers-color-scheme: dark) {
		.burntivory {
			background-color: #1b263c;
		}
		.oldsilver {
			background-color: #15181f;
		}
		.submitter {
			color: #eae7e0;
		}
		.subtitle {
			color: rgba(255, 255, 255, 0.6);
		}
		* * {
			color: rgba(255, 255, 255, 0.87);
		}
		a,
		a *:not(.ovimp),
		.linkcolor,
		.linkcolor * {
			color: #3982bf;
		}
	}
</style>
<style scoped>
	.main.hide {
		filter: brightness(70%);
	}
	.main.hide button {
		pointer-events: none;
	}
	.main {
		max-width: 100vw;
		transition: var(--trbg), filter 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
			margin-left 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
			width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}
	@media (min-width: 501px) {
		.main {
			position: absolute;
			left: 0;
		}
		.main:not(.left) {
			width: 81.3%;
			margin-left: 18.7%;
		}
		.main.left {
			width: 100%;
		}
	}
	#pwdReset {
		z-index: 999;
		top: max(10%, 25dvh);
		fieldset {
			padding-top: 2em;
			label {
				position: relative;
			}
			input {
				border-bottom: 2px solid currentColor;
				position: relative;
				margin-bottom: 2em;
				top: -1em;
			}
			.submitter {
				align-self: center;
			}
		}
	}
</style>
