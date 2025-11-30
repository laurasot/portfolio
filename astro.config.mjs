// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    build: {
        inlineStylesheets: 'auto',
        assets: 'assets',
    },
    vite: {
        css: {
            devSourcemap: false,
        },
        build: {
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
    },
});
