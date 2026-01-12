import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';

export default defineConfig([
    globalIgnores([
        'dist',
        'node_modules',
    ]),
    ...eslintPluginAstro.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.serviceworker,
            },
        },
        rules: {
            'arrow-body-style': 'off',
        },
    },
]);
