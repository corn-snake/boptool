<script setup>
    import { computed } from 'vue';
    import { compBop, bopData } from '../../stores/bopstore';
    import GenericLine from './GenericLine.vue';
    const props = defineProps(["st"]);
    const selTurn = (tn = -1) => bopData.turn = tn;
</script>
<template>
    <GenericLine :array="Object.keys(compBop.history)" :si="props.st" @selItem="k=>selTurn(k.value)" pronomen="T"/>
</template>