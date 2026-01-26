import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import { apiServer } from "vite-api-server";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
        //apiServer({handler: "./serve/routing.js"})
    ],
    server: {
        port: 80
    }
})
