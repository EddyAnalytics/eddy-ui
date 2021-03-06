module.exports = {
    root: true,

    env: {
        node: true,
    },

    extends: ['plugin:vue/essential', '@vue/prettier'],

    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'prettier/prettier': [
        'error',
        {
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'all',
          htmlWhitespaceSensitivity: 'ignore'
        }
      ],
      'graphql/template-strings': [
        'error',
        {
          env: 'apollo',
          projectName: 'eddy-ui',
          schemaJsonFilepath: 'src/graphql/schema.json'
        }
      ]
    },

    parserOptions: {
        parser: 'babel-eslint',
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },

    plugins: [
      'graphql'
    ]
};
