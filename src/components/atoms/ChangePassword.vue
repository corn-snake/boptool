<script setup>
    import { computed, reactive, ref } from 'vue';
    import { changePwd } from '../../stores/authStore';

    const emit = defineEmits(["done"]);
    const data = reactive({pwd: '', pwdConf: ''}),
        breathing = ref(false),
        ded = computed(()=>data.pwd !== data.pwdConf || data.pwd.length < 7);

    const tryChange = e=>{
		e.preventDefault();
		if (data.pwdConf !== data.pwd) return alert("passwords don't match!")
		if (ded.value) return alert("password needs to be 7 characters or more!")
		breathing.value = true;
		changePwd(data.pwd).then(r=>{
		    if (r.status === 204)
				return emit("done");
			throw new Error(r);
		}).catch(r=>alert(`something happened!\n\n${r}`)).finally(()=>breathing.value = false);
    }
</script>

<template>
    <form>
		<fieldset class="flex columnar">
			<legend>Password reset</legend>
			<div>
    			<label for="newPwd">Type in new password (at least 7 characters):</label>
    			<br/>
    			<input type="password" name="newPwd" id="newPwd" v-model="data.pwd" />
			</div>
			<div>
			    <label for="pwdConf">Confirm:</label>
				<br/>
    			<input type="password" name="pwdConf" id="pwdConf" v-model="data.pwdConf" />
			</div>
			<button
				:class="['submitter', breathing ? 'breathing' : '', ded ? 'ded' : '']"
				@click="tryChange"
			>
				{{ breathing ? "Wait..." : "Submit" }}
			</button>
		</fieldset>
	</form>
</template>

<style scoped>
    input {
        border-bottom: 1px solid var(--linkcolor);
        width: 100%;
    }
    fieldset {
        row-gap: 5px;
    }
</style>