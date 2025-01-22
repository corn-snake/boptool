<script setup>
    import { ref, watch, nextTick, onMounted, useTemplateRef, computed } from 'vue';
    const props = defineProps(["si", "array", "pronomen", "spacing", "rtl", "ccolor", "vertical"]);
    defineEmits(["selItem"]);

    const filler = computed(()=>[...props.array]);
    const selled = computed(()=>props.si);

    const div = useTemplateRef("list");

    onMounted(async () => {
        await nextTick();
        div.value.scrollTo(props.vertical ? {top: props.rtl !== true ? div.value.offsetHeight : 0} : {left: props.rtl !== true ? div.value.offsetWidth : 0});
    });
</script>
<template>
    <nav ref="list" :class="[props.vertical ? 'vert' : '']">
        <h3 v-for="item in filler" :class="[selled == item ? 'sel' : '']" @click="$emit('selItem',item)">
        {{ `${props.pronomen || ""}${props.spacing ? " " : ""}${item}` }}
        </h3>
    </nav>
</template>
<style scoped>
    nav {
        padding: 0 3rem .5625rem 1.15rem;
        display: flex;
        justify-content: space-around;
        flex-shrink: 2em;
        overflow-x: scroll;
        &.vert {
            flex-direction: column;
        }
        &.fwn {
            h3 {
                font-weight: normal;
            }
        }
    }
    h3 {
        display: inline-block;
        padding: 0 .5em;
        border-left: 2pt solid transparent;
        border-right: 2pt solid transparent;
        transition: var(--trcolor), border-color 0.2s ease-in;
        &.sel {
            color: color-mix(in srgb, currentColor 70%, transparent 30%);
            border-left: 2pt solid palevioletred;
            border-right: 2pt solid palevioletred;
            pointer-events: none;
        }
    }
</style>