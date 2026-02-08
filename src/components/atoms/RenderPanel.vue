<script setup>
	import { ref, watch } from 'vue';
    /*import preset from '@bbob/preset-vue';
	const myPreset = preset.extend(defTags => ({
		...defTags,
		img: (node) => ({
			tag: 'img',
		}) && console.log(node)
	}));
	const plugins = [
		myPreset()
	];*/
	// ignore that until they fix their shit
	const props = defineProps(["file", "hostOrder", "pastOrder"]);
	const toRender=ref(props.file);
	const fullHeight = ref(false),
        toggleFullHeight = () => fullHeight.value = !(fullHeight.value);
	watch(()=>props.file, (nv,ov)=>toRender.value = props.file);

	import { finalParser } from '../../stores/bopstore';
</script>
<template>
	<div class="showRenderBox">
        <div><label for="fullHeight">Display at full height: </label>
        <input type="checkbox" :value="toggleFullHeight" name="showRender" @click="toggleFullHeight" /></div>
    </div>
	<article :class="['renderedArea', fullHeight === true ? 'fh' : 'ah']" v-html='finalParser.toHTML(
    	props.hostOrder === true && toRender.trim().length === 0 ? "[i][u]This player sent no orders![/u][/i]" :
    	props.hostOrder === true && toRender === "FILEEMPTY" ? "[i][u]This player just entered the fray![/u][/i]" :
        props.pastOrder === true && toRender === "FILEEMPTY" ? "[i]You sent no orders for this turn![/i]" :
    	toRender === "FILEEMPTY" ? "[i][u]This section is empty; contact your local bophost to correct it.[/u][/i]" : toRender )'>
     </article>
</template>
<style scoped>
    .showRenderBox {
        padding: 0 calc(1.5 * 0.8rem);
        font-style: italic;
        display: flex;
        justify-content: space-around;
        margin-bottom: 0.4rem;
    }
    .fh.renderedArea {
        height: fit-content;
        resize: none;
        max-height: fit-content;
    }
    .ah.renderedArea {
        height: 150px;
        overflow-y: scroll;
        resize: vertical;
        max-width: calc(100vw - 4rem);
    }
    main:not(.dt) .ah.renderedArea {
        box-shadow: 0px 0px 5px 0px rgba(129,81,39,1);
    }
    main.dt .ah.renderedArea {
        box-shadow: 0px 0px 5px 0px rgba(255,255,255,.5);
    }
    @media (min-width: 601px) {
        .ah.renderedArea {
            margin: 0 2rem;
            height: 34vh;
        }
    }
    @media (max-width: 600px) {
        .renderedArea {
            margin: 0 0.7rem;
            flex-direction: column;
            min-height: 50vh;
            height: 50vh;
            padding-bottom: 3px;
        }
    }
</style>