import { createRouter, createWebHistory } from "vue-router"
import Login from '../views/Login.vue'
import Landing from "../views/Landing.vue";
import Noble from "../views/Noble.vue";
import Micromanager from "../views/Micromanager.vue";
import MainFrame from "../views/MainFrame.vue";

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