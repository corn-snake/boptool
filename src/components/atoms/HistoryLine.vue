<script setup>
    import { computed } from 'vue';
    import { compBop, bopData } from '../../stores/bopstore';
    import GenericLine from './GenericLine.vue';
    const props = defineProps(["st"]);
    defineEmits(["selTurn"]);
</script>
<template>
    <GenericLine :array="Object.keys(compBop.history)" :si="props.st" @selItem="n=>$emit('selTurn', n.value)" pronomen="T"/>
</template>