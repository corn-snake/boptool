<script setup>
    import { fileget } from '../../lib/runtimeActs.js';
    import { bopData, finalParser } from '../../stores/bopstore.js';

    const props = defineProps(["turn", "player", "type"])
    function openWindow() {
        //Tb#t#p#
        fileget(bopData.bop, props.turn, bopData.claim, props.player, props.type).then(t => {
            const b = finalParser.toHTML(t);
            const newWindow = window.open("", null, "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");
            const st = newWindow.document.createElement("link");
            st.href = "/bopitem.css";
            st.rel = "stylesheet";
            newWindow.document.head.append(st);
            newWindow.document.body.innerHTML = b;
        });
    }
</script>

<template>
    <a class="keepdt" @click="openWindow" :title="`Open ${({C: 'card', R: 'report', O: 'orders'})[props.type]} for turn ${props.turn}`">
        <slot></slot>
    </a>
</template>

<style scoped>
    a {
        cursor: pointer;
    }
</style>