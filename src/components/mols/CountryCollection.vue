<script setup>
    import { reactive } from 'vue';
    import GenericPanel from '../atoms/GenericPanel.vue';
    const croStat = reactive({
		c: true,
		r: true,
		o: true,
	});
    const props = defineProps(['strip', 'bindToPlayer']);
</script>
<template>
    <div>
        <GenericPanel type="C" :d="croStat.c" @turn="croStat.c = !croStat.c" :strip="props.strip" :doubleBind="props.bindToPlayer" />
        <GenericPanel type="R" :d="croStat.r" @turn="croStat.r = !croStat.r" :strip="props.strip" :doubleBind="props.bindToPlayer" />
        <GenericPanel type="O" :d="croStat.o" @turn="croStat.o = !croStat.o" :strip="props.strip" :doubleBind="props.bindToPlayer" />
    </div>
</template>