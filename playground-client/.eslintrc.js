module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:prettier/recommended', 'plugin:react-hooks/recommended', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['prettier', 'jest', 'react', 'react-hooks'],
    rules: {
        'prettier/prettier': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        // TODO: just for now until I have a stable version, then maybe ts? maybe just js
        'react/prop-types': 'off',
    },
    globals: {
        __webpack_require__: 'readonly',
    },
    overrides: [
        {
            files: ['**/*.spec.js', '**/*.spec.jsx', '**/*.test.js', '**/*.test.jsx'],
            globals: {
                global: 'readonly',
            },
            env: {
                jest: true,
                'jest/globals': true,
            },
        },
    ],
};
