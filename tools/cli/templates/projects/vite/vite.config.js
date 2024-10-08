import htmlImport from '@ayatkyo/vite-plugin-html-import';

export default {
    // config options
    build: {
        cssCodeSplit: false,
        assetsInlineLimit: 0,
    },
    optimizeDeps: {
        exclude: ['coherent-gameface-components'],
    },
    plugins: [htmlImport()],
};
