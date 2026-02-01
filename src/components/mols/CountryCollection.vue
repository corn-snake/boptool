<script setup>
    import { reactive } from 'vue';
    import GenericPanel from '../atoms/GenericPanel.vue';
    const croStat = reactive({
		c: true,
		r: true,
		o: true,
	}),
    closeAll = ()=>{
        croStat.c = false; croStat.r = false; croStat.o = false;
    };
    const props = defineProps(['strip', 'bindToPlayer']);
</script>
<template>
    <div>
        <GenericPanel type="C" :d="croStat.c" @turn="croStat.c = !croStat.c" :strip="props.strip" :doubleBind="props.bindToPlayer" />
        <GenericPanel type="R" :d="croStat.r" @turn="croStat.r = !croStat.r" :strip="props.strip" :doubleBind="props.bindToPlayer" />
        <GenericPanel type="O" :d="croStat.o" @turn="croStat.o = !croStat.o" :strip="props.strip" :doubleBind="props.bindToPlayer" />
        <nav class="slideAll" v-show="croStat.c + croStat.r + croStat.o > 1" @click="closeAll"><small><em>Close'em all</em>&nbsp;<span :class="['disp', props.d ? '' : 'down']"><svg width="1em" height="1em" viewBox="0 0 100 100">
			<path d="M10 90 L45 35 Q50 30 55 35 L90 90"
				stroke="rgba(0, 0, 0, 0.87)" stroke-width="1em"
				fill="transparent" />
		</svg></span></small></nav>
    </div>
</template>
<style scoped>
    .slideAll {
	    display: flex;
		padding-right: 2.5rem;
		justify-content: center;
	}
	main.dt svg {
	    filter: invert(100%);
	}
</style>