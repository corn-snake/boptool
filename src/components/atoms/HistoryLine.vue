<script setup>
    import { compBop, bopData } from '../../stores/bopstore';
    import GenericLine from './GenericLine.vue';
    import NewTurn from './NewTurn.vue';
    const props = defineProps(["st"]);
    defineEmits(["selTurn"]);
</script>
<template>
    <GenericLine :array="bopData.claim < 1 ? compBop.history.map(h=>h.number) : compBop.history" :si="props.st" @selItem="n=>$emit('selTurn', n.value)" pronomen="T">
        <NewTurn v-if="bopData.claim === 2 && bopData.turn === compBop.history.at(-1)"/>
    </GenericLine>
</template>