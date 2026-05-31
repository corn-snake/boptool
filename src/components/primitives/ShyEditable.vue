<script setup>
import { computed, ref } from 'vue';
defineEmits(["update:modelValue"]);

    const props = defineProps(["modelValue", "editing"]),
        edit = ref(props.editing ?? false),
        hasPropEd = computed(()=>props.editing === true);
</script>
<template>
    <span class="shywrap"><span v-if="hasPropEd ? !editing : !edit" @click="hasPropEd ? (props.editing = !(props.editing)) : edit = !edit">{{props.modelValue}}</span>
    <input class="shyinput" v-if="hasPropEd ? editing : edit" type="text" :value="props.modelValue" @input="e=>$emit('update:modelValue', e.target.value)"/>
    &nbsp;&nbsp;
    <svg @click="hasPropEd ? (props.editing = !(props.editing)) : edit = !edit" v-if="hasPropEd ? !editing : !edit" height="1rem" width="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 0L16 3L9 10H6V7L13 0Z" fill="#000000"></path> <path d="M1 1V15H15V9H13V13H3V3H7V1H1Z" fill="#000000"></path> </g></svg>
    <!--
    Noah Jacobus
    https://www.svgrepo.com/svg/535562/pencil-square
    -->
    <svg class="uptick" @click="hasPropEd ? (props.editing = !(props.editing)) : edit = !edit" v-if="hasPropEd ? editing : edit" height="1.5rem" width="1.5rem" fill="#000000" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"></path></g></svg>
    <!--
    stephenhutchings
    https://www.svgrepo.com/svg/368185/tick
    -->
    </span>
</template>
<style scoped>
    .shywrap {
        border: none;
        border-bottom: 1px solid var(--linkcolor);
    }
    .shyinput {
        field-sizing: content;
    }
    .uptick {
        margin-top: -0.2rem;
    }
</style>