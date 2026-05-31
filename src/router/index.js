import { createRouter, createWebHistory } from "vue-router"
import Login from '../components/views/Login.vue'
import Landing from "../components/views/Landing.vue";
import Ndända from "../components/views/Ndända.vue"
import Noble from "../components/views/Noble.vue";
import MainFrame from "../components/views/MainFrame.vue";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/mat',
        name: 'Ndända',
        component: Ndända
    },
    {
        path:'/bop/:id',
        name: "BoP",
        component: MainFrame
    },
    {
        path:'/bop/:claim/:id',
        name: "Panel",
        component: Noble
    },
];

const router = createRouter({
    history: createWebHistory(window.location.host.substring(0,window.location.host.indexOf('/', 7))),
    linkExactActiveClass: 'current',
    routes
});

export default router;