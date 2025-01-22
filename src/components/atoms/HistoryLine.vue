<script setup>
    import { computed } from 'vue';
    import { compBop } from '../../stores/bopstore';
    import GenericLine from './GenericLine.vue';
    const props = defineProps(["st"]);
    defineEmits(["selTurn"]);
</script>
<template>
    <GenericLine :array="Object.keys(compBop.history)" :si="props.st" @selItem="k=>$emit('selTurn',k)" pronomen="T"/>
</template>