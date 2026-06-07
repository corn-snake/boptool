<script setup>
    import { ref } from 'vue';
	import { isAuth, killLogin, usr } from "../../stores/authStore.js";
	import Imagey from "./../primitives/Imagey.vue";
	import { bopData, compBop } from "../../stores/bopstore.js";
	import { useRouter } from 'vue-router';
	const buttonBreathing = ref(false),
	breathe = ()=>buttonBreathing.value = true,
	gasp = ()=>buttonBreathing.value = false;
	const router = useRouter();
	defineEmits(['hideShow']);
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
		    <svg class="hbg" fill="currentColor" height="1.5rem" width="1.5rem" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g id="SVGRepo_iconCarrier"> <g transform="matrix(1,0,0,1,-1088,-192)"> <rect id="Icons" x="0" y="0" width="1280" height="800" style="fill:none;"></rect> <g id="Icons1" serif:id="Icons"> <g id="hamburger-2" transform="matrix(1.50868,0,0,1.01217,70.647,191.772)"> <g transform="matrix(0.149202,0,0,0.173437,664.206,42.142)"> <rect x="103.288" y="8.535" width="71.218" height="34.133" style="fill-rule:nonzero;"></rect> </g> <g transform="matrix(0.149202,0,0,0.173437,664.345,27.4)"> <rect x="103.288" y="8.535" width="141.366" height="34.133" style="fill-rule:nonzero;"></rect> </g> <g transform="matrix(0.149202,0,0,0.173437,664.345,12.658)"> <rect x="103.288" y="8.535" width="212.447" height="34.133" style="fill-rule:nonzero;"></rect> </g> </g> </g> </g> </g></svg>
			<!--
			    javisperez
				https://www.svgrepo.com/svg/493683/hamburger-2-menu-mobile
				under the apache license, 2.0: https://raw.githubusercontent.com/javisperez/toe-icons/refs/heads/master/LICENSE
			-->
		</button>
		<span class="bopname" v-if="compBop.title.length > 0">
		    {{ compBop.title }} :: {{ bopData.country }}
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
					breathe();
					killLogin(() => {
					    gasp();
                        router.push('/login');
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
	.bopname, .hbg {
	    color: var(--titlecolor);
	}
</style>
<style></style>
<script></script>
