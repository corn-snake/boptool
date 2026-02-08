import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import {isAuth} from './stores/authStore.js';
import SlideUpDown from 'vue-slide-up-down';
import VSelect from 'vue3-select';
import 'vue3-select/dist/vue3-select.css'

router.beforeEach((to)=>{
    if (!isAuth.value && to.name !== "Login") return {name:'Login'};
    if (isAuth.value && to.name == "Login") return {name:'Landing'};
});

const app = createApp(App).use(router).component('slide-up-down', SlideUpDown).component('vselect',VSelect).mount('#app');
