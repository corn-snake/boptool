<script setup>
    import { ref, watch, computed, reactive } from 'vue';
    defineEmits(["edit"]);
    const props = defineProps(["file"]);
    const shy = reactive({
        editor: false,
        preview: true
    });
	const toRender=ref("[i]loading...[/i]"),
	    rendered = computed(()=>bbcparser.toHTML(toRender.value === "FILEEMPTY" ? "[i][u]This section is empty; contact your local bophost to correct it.[/u][/i]" : toRender.value));
	watch(()=>props.file, (nv,ov)=>toRender.value = props.file);
	const showRender = ref(false),
        toggleRender = () => showRender.value = !(showRender.value),
        fullHeight = ref(false),
        toggleFullHeight = () => fullHeight.value = !(fullHeight.value);
	import { bbcparser } from '../../stores/bopstore';
</script>
<template>
    <div class="showRenderBox">
        <div><label for="showRender">Show visual rendering: </label>
        <input type="checkbox" :value="showRender" name="showRender" @click="toggleRender" /></div>
        <div><label for="fullHeight">Display at full height: </label>
        <input type="checkbox" :value="toggleFullHeight" name="showRender" @click="toggleFullHeight" /></div>
    </div>
    <div :class="['rendering', fullHeight === true ? 'fh' : 'ah']">
        <textarea v-model='toRender' class="editorArea" @input="e=>$emit('edit',e)"></textarea>
        <article v-html='rendered' v-if="showRender" class="renderedArea"></article>
    </div>
</template>
<style scoped>
    .showRenderBox {
        padding: 0 calc(1.5 * 0.8rem);
        font-style: italic;
        display: flex;
        justify-content: space-around;
        margin-bottom: 0.4rem;
    }
    .rendering {
        display: flex;
        max-width: 100%;
        flex-grow: 0;
        margin-top: 1rem;
        gap: 1rem;
    }
    .editorArea {
        /*max-width: calc(100vw - calc(24px + 1.6rem + 1.5rem + 8.5rem));*/
        display: block;
        width: 100%;
        border: none;
        padding: 0;
        margin: 0;
        overflow-y: wrap;
        overflow-x: wrap;
    }
    .editorArea, .renderedArea {
        overflow-y: scroll;
    }
    main:not(.dt) .editorArea {
        background-color: #E8DECD;
    }
    main.dt .editorArea {
        background-color: #ABB1B5;
        color: black;
    }
    main:not(.dt) .renderedArea {
        box-shadow: 0px 0px 5px 0px rgba(129,81,39,1);
    }
    main.dt .renderedArea {
        box-shadow: 0px 0px 5px 0px rgba(255,255,255,.5);
    }
    .rendering * {
        transition: var(--trcolor), var(--trbg), width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), max-width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    }
    @media (max-width: 600px) {
        .rendering {
            flex-direction: column;
            min-height: 50vh;
            height: 50vh;
            padding-bottom: 3px;
        }
        .editorArea:not(:has(+ .renderedArea)) {
            height: 100%;
        }
        .editorArea:has(+ .renderedArea), .renderedArea {
            height: calc(50% - 0.5rem);
        }
        .fh, .fh .editorArea, .fh .renderedArea {
            height: fit-content;
            resize: none;
        }
    }
    @media (min-width: 601px) {
        .rendering {
            flex-direction: row;
            margin: 0 2.5rem;
            min-height: 150px;
        }
        .rendering.ah {
            resize: vertical;
            overflow: hidden;
            height: 30vh;
        }
        .rendering.ah .editorArea {
            max-width: calc(100vw - 24px);
        }
        .editorArea, .renderedArea {
            display: inline-block;
            width: 50%;
            flex-grow: 1;
            flex-shrink: 1;
        }
        .fh, .fh .editorArea, .ah .editorArea:not(:has(+ .renderedArea)) {
            resize: none;
        }
        .ah .editorArea:has(+ .renderedArea) {
            resize: horizontal;
        }
        .ah .editorArea, .ah .renderedArea {
            max-height: 100%;
            overflow-y: scroll;
        }
        .fh .renderedArea, .fh .renderedArea {
            max-height: fit-content;
        }
        .editorArea:has(+ .renderedArea), .renderedArea {
            max-width: calc(calc(100vw - 24px - 15.1rem) * 0.75);
            min-width: calc(calc(100vw - 24px - 15.1rem) * 0.25);
        }
        .sidebar.on + main .editorArea {
            max-width: calc(100vw - 24px - 15.1rem);
        }
        .sidebar.on + main .editorArea:has(+ .renderedArea), .sidebar.on + main .renderedArea {
            max-width: calc(calc(100vw - 18.7vw - 24px - 15.1rem) * 0.75);
            min-width: calc(calc(100vw - 18.7vw - 24px - 15.1rem) * 0.25);
        }
    }
</style>
<style>
    span :not(hr):empty::after {
        display: inline-block;
        width: 5px;
        content: "";
        border-radius: 20%;
        background-color: rgba(75, 75, 75, .6);
    }

    :not(.dt) .markup_artifact {
        color: #707070;
        font-family: monospace;
        display: inline;
        font-size: small;
    }

    .faketable {
        display: table;
        & > br:first-child {
            display: none;
        }
    }

    .fakerow {
        display: table-row;
        & > br:nth-child(2) {
            display: none;
        }
    }

    .faketd {
        display: table-cell;
        &.head {
            font-weight: bold;
            text-align: center;
        }
    }

    .hrwrap {
        display: inline;
        hr {
            width: calc(100% - 3em);
            margin: 0;
            right: -3em;
            position: relative;
            top: -.7em;
        }
    }

</style>