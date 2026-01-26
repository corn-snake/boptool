<script setup>
    import { ref, watch, computed, reactive } from 'vue';
    const props = defineProps(["file"]);
    const shy = reactive({
        editor: false,
        preview: true
    });
	const toRender=ref("[i]loading...[/i]"),
	    rendered = computed(()=>bbcparser.toHTML(toRender.value === "FILEEMPTY" ? "[i][u]This section is empty; contact your local bophost to correct it.[/u][/i]" : toRender.value));
	watch(()=>props.file, (nv,ov)=>toRender.value = props.file);
	import { bbcparser } from '../../stores/bopstore';;
</script>
<template>
    <div>
        <!--slide-up-down :active="!shy.editor" :duration="400" tag="article" contenteditable="true" @input.native="e => toRender = e.target.textContent" class="editorArea"/><br>
        <slide-up-down :active="shy.preview" :duration="400" tag="article"  /-->
        <article v-html='rendered'></article>
    </div>
</template>
<style scoped>
    span :not(hr):empty::after {
        display: inline-block;
        width: 5px;
        content: "";
        border-radius: 20%;
        background-color: rgba(75, 75, 75, .6);
    }
</style>
<style>
    @keyframes blink {
        0% {
            opacity: 100%;
        }
        49% {
            opacity: 100%;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }
    .caret {
        display: inline;
        animation: blink 1s none 0s infinite;
        &::after {
            width: 1px !important;
            margin: -.5px;
            position: relative;
            background-color: black !important;
            line-height: 90%;
            translate: -.25px;
            border-radius: 0 !important;
        }
    }

    .dt .caret::after {
        filter: invert(100%);
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

    .editorArea {
        max-width: 100%;
        display: block;
        max-height: min(70vh, 300px);
        overflow-y: wrap;
    }

</style>