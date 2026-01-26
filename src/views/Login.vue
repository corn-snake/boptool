<script setup>
	import { ref, reactive } from "vue";
	import { tryAuth, lastLoginAttemptStatus } from "../stores/authStore.js";
	const ralive = reactive({
			user: false,
			pwd: false,
			spwd: false,
		}),
	    whatWrong = ref(-1),
		wrong = (n)=>whatWrong.value = n,
		buttonAlive = ref(false),
		buttonBreathing = ref(false),
		rvals = reactive({
			usr: "",
			pwd: "",
		}),
		buttonCheck = () => {
		    buttonAlive.value = ralive.pwd && ralive.user;
			wrong(-1);
		},
		checkUser = (v) => {
			v.value.length > 0 ? (ralive.user = true) : (ralive.user = false);
			buttonCheck();
		},
		checkPwd = (v) => {
			v.value.length > 7 ? (ralive.pwd = true) : (ralive.pwd = false);
			buttonCheck();
		},
		checkPwdSimple = (v) => {
			v.value.length > 0 ? (ralive.spwd = true) : (ralive.spwd = false);
			buttonCheck();
		},
		breathe=()=>buttonBreathing.value = true,
		gasp = ()=>buttonBreathing.value = false;
</script>
<template>
	<form class="login-form">
		<div :class="['input-wrap', whatWrong === 1 ? 'wrong' : '', { on: ralive.user }]">
			<label for="username">Username</label
			><input
				type="text"
				name="username"
				id="username"
				class="inp-noout"
				@input="(e) => checkUser(e.target)"
				v-model="rvals.usr"
			/>
		</div>
		<div :class="['input-wrap', whatWrong >= 1 ? 'wrong' : '', { on: ralive.spwd }]">
			<label for="password">Password</label
			><input
				type="password"
				name="password"
				id="password"
				class="inp-noout"
				@input="
					(e) => {
						checkPwd(e.target);
						checkPwdSimple(e.target);
					}
				"
				v-model="rvals.pwd"
			/>
		</div>
		<button
			id="submitlogin"
			:class="['submitter', 'inp-noout', buttonAlive ? '' : 'ded', buttonBreathing ? 'breathing' : '']"
			@click="
				(e) => {
					e.preventDefault();
					$emit('loading');
					breathe();
					tryAuth(rvals.usr, rvals.pwd, ()=>$emit('loaded'), () => {
					    gasp();
						$emit('loaded');
						if (lastLoginAttemptStatus == 404) wrong(1);
						if (lastLoginAttemptStatus == 403) wrong(2);
					})
				}
			"
		>
			{{ buttonBreathing ? "Wait..." : "Sign In" }}
		</button>
	</form>
</template>

<script></script>

<style scoped>
	form {
		display: flex;
		margin: 1em;
	}
	input {
		border-bottom: 2px solid currentColor;
		z-index: 1;
		margin-top: 4px;
		position: relative;
		width: 20em;
	}
	label {
		transition: var(--trcolor), font-size 0.4s ease-in, transform 0.4s ease-in;
		z-index: 0;
		position: absolute;
	}
	.input-wrap {
		margin-top: 16px;
		margin-right: 4em;
	}
	.input-wrap,
	.input-wrap * {
		display: block;
		color: color-mix(in srgb, currentColor 87%, transparent);
	}
	.input-wrap:hover,
	.input-wrap:focus-within,
	.input-wrap:hover *,
	.input-wrap:focus-within *,
	.input-wrap.on {
		color: currentColor;
	}
	.input-wrap:focus-within label,
	.input-wrap.on label {
		font-size: 0.7em;
		transform: translateY(-70%);
	}
	.wrong {
        animation-name: shake-input;
        animation-duration: 1.4s;
        animation-timing-function: (4, jump-both);
    }
    @keyframes shake-input {
        0% {
            color: #c55;
            transform: translateX(0px)
        }
        25% {
            transform: translateX(-10px)
        }
        50% {
            transform: translateX(10px)
        }
        75% {
            transform: translateX(-10px)
        }
        100% {
            color: #c55;
            transform: translateX(0px)
        }
    }
	@media (max-width: calc(2rem + 24px + 40rem + 8rem)) {
		form {
			flex-direction: column;
			& > * {
				margin-top: 2rem;
			}
		}
		#submitlogin {
			width: fit-content;
		}
	}
</style>
