import { defineConfig } from 'vite';
import path from 'path';

const local = process.env.LOCAL_DEV === 'true';

export default defineConfig({
    plugins: [],
    build: {
        rollupOptions: {
            external: local
                ? []  
                : [
                    '@clayui/badge',
                    '@clayui/button',
                    '@clayui/card',
                    '@clayui/core',
                    '@clayui/css',
                    '@clayui/data-provider',
                    '@clayui/form',
                    '@clayui/icon',
                    '@clayui/layout',
                    '@clayui/link',
                    '@clayui/modal',
                    '@clayui/nav',
                    '@clayui/panel',
                    '@clayui/table',
                    '@clayui/tabs',
                    '@clayui/tooltip',
                    'react',
                    'react-dom'
                ]
        },
        outDir: path.resolve(__dirname, 'build/static'),
        emptyOutDir: true,
        assetsDir: 'assets',
    }
});
