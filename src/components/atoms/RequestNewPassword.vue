<script setup>
    import { computed, reactive, ref } from 'vue';
    import { requestReset } from '../../stores/authStore';

    const emit = defineEmits(["done"]);
    const data = reactive({uname: '', email: ''}),
        breathing = ref(false),
        ded = computed(()=>data.uname < 4 || data.email.length < 11);

    const reqNew = e=>{
		e.preventDefault();
		if (data.uname.length < 4) return alert("username is invalid!")
		if (data.email.length < 11 || (/[a-zA-Z0-9\-\.]{3,}@[a-zA-Z0-9\-\.]{4,}\.[a-zA-Z]{2,}/g).test(data.email) !== true)
            return alert("email is invalid!")
		breathing.value = true;
		requestReset(data.uname, data.email).then(async(r)=>{
		    if (r.status === 202 || r.status === 200) {
                alert(await r.text());
				return emit("done");
			}
			throw new Error(await r.text());
		}).catch(e=>alert(`something happened!\n\n${e}`)).finally(()=>breathing.value = false);
    }
</script>

<template>
    <form>
		<fieldset class="flex columnar">
			<legend>Request a new password</legend>
			<div>
    			<label for="uname">Enter your username:</label>
    			<br/>
    			<input type="text" name="uname" id="uname" v-model="data.uname" />
			</div>
			<div>
			    <label for="email">Enter the email associated with your account:</label>
				<br/>
    			<input type="email" name="email" id="email" v-model="data.email" />
                <br/>
                <small><em>If you don't have one, you'll have to ask an admin to do this manually. Ask your local game host if they can tell them, or do so directly if you know one.</em></small>
			</div>
			<button
				:class="['submitter', breathing ? 'breathing' : '', ded ? 'ded' : '']"
				@click="reqNew"
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