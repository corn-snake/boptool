<script setup>
    import { ref, watch, nextTick, onMounted, useTemplateRef, computed } from 'vue';
    const props = defineProps(["si", "sin", "array", "pronomen", "spacing", "rtl", "ccolor", "vertical", "rpad", "nopad"]);
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
    <nav ref="list" :class="[props.vertical ? 'vert' : '', props.rpad ? 'rpad' : '', props.nopad ? 'nopad' : '']">
        <h3 v-for="value, number in filler" :class="[(props.sin === true && selled == number) || selled == value ? 'sel' : '']" @click="$emit('selItem',{value,number})">
        {{ `${props.pronomen || ""}${props.spacing ? " " : ""}${value}` }}
        </h3>
    </nav>
</template>
<style scoped>
    nav {
        padding: 0 1.6rem;
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
        &.rpad {
             padding: 0 3rem .5625rem 1.15rem;
        }
        &.nopad {
            padding: 0;
        }
    }
    h3 {
        display: inline-block;
        padding: 0 .5em;
        border-left: 2pt solid transparent;
        border-right: 2pt solid transparent;
        transition: var(--trcolor), border-color 0.2s ease-in;
        &.sel {
            border-left: 2pt solid palevioletred;
            border-right: 2pt solid palevioletred;
            pointer-events: none;
        }
    }
    :not(.dt) h3.sel {
        color: color-mix(in srgb, currentColor 70%, transparent 30%);
    }
    .dt h3.sel {
        color: color-mix(in srgb, currentColor 70%, salmon 30%);
    }
</style>