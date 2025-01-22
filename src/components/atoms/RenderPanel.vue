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
	const props = defineProps(["file"]);
	const toRender=ref("[i]loading...[/i]");
	watch(()=>props.file, (nv,ov)=>toRender.value = props.file);

	import { finalParser } from '../../stores/bopstore';
</script>
<template>
	<!--div class="html">
		<bbob-bbcode container="div" :plugins="plugins">
			{{ toRender === "FILEEMPTY" ? "[i][u]This section is empty; contact your local bophost to correct it.[/u][/i]" : toRender }}
		</bbob-bbcode>
	</div-->
	<span v-html='finalParser.toHTML(toRender === "FILEEMPTY" ? "[i][u]This section is empty; contact your local bophost to correct it.[/u][/i]" : toRender )'> </span>
</template>