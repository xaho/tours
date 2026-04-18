import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: {
            globals: globals.browser,
        }
    },
    pluginJs.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        plugins: {
            '@stylistic/js': stylisticJs
        },
        rules: {
            '@stylistic/js/quotes': ['error', 'single', {'avoidEscape': true}],
            '@stylistic/js/semi': ['error', 'always'],
        },
        languageOptions: {
            globals: {
                'google': 'readonly'
            }
        }
    }
];