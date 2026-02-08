import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        hmr: {
            host: "boptwooltest.cornsnake.fyi"
        },
        host: true,
        allowedHosts: ["boptwooltest.cornsnake.fyi"],
        port: 80,
        proxy: {
            '/api': {
                target: 'http://localhost:800',
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
