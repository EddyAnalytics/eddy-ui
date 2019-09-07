module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', '@vue/prettier'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prettier/prettier': [
            'error',
            {
                printWidth: 100,
                singleQuote: true,
                trailingComma: 'all',
                htmlWhitespaceSensitivity: 'ignore',
            },
        ],
    },
    parserOptions: {
        parser: 'babel-eslint',
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },
};
