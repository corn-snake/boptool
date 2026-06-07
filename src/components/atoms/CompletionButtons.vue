<script setup>
    import { ref } from 'vue';
    import { bopData, compBop } from '../../stores/bopstore.js';
    import { updateCompletion } from '../../lib/runtimeActs.js';
    const breathing = ref(false);
    const progressStatus = () => compBop.validated.includes(bopData.player) ? 2 : compBop.completed.includes(bopData.player) ? 1 : 0;
    const action = () => {
        if (breathing.value) return;
        const p = progressStatus();
        if (p === 2) return;
        breathing.value = true;
        return updateCompletion(bopData.bop, bopData.player, p === 1 ? true : false)
            .then(r => { if (!r.ok) throw r.status; return r.json() })
            .then(r => {
                if (!r) throw r;
                if (p === 1) return compBop.validated.push(compBop.completed.splice(compBop.completed.findIndex(e=>e===bopData.player), 1)[0]);
                if (p === 0) return compBop.completed.push(bopData.player);
            })
            .catch(e=>console.log(e))
            .finally(() => breathing.value = false);
    };
</script>

<template>
    <button :class="['submitter', {breathing}]" v-if="progressStatus() < 2" @click="action">{{ breathing ? "Wait..." : `Mark as ${(['Completed', 'Validated', '???'])[progressStatus()]}`}}</button>
</template>

<style scoped>
    button {
        margin: 0 auto;
        margin-top: 1rem;
    }
</style>