import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
    {
        files: ['**/*.js'],
        languageOptions: {sourceType: 'script'}
    },
    {
        languageOptions: {
            globals: globals.browser
        }
    },
    pluginJs.configs.recommended,
    {
        plugins: {
            '@stylistic/js': stylisticJs
        },
        rules: {
            '@stylistic/js/quotes': ['error', 'single', { 'avoidEscape': true }]
        },
        languageOptions: {
            globals: {
                'google': 'readonly'
            }
        }
    }
];