import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import {isAuth} from './stores/authStore.js';
import SlideUpDown from 'vue-slide-up-down';

router.beforeEach((to,from)=>{
    if (!isAuth.value && to.name !== "Login") return {name:'Login'};
    if (isAuth.value && to.name == "Login") return {name:'Landing'};
});

const app = createApp(App).use(router).component('slide-up-down', SlideUpDown).mount('#app');
