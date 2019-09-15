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
    // TODO: Needs env dependent remote schema fetching: grapql-cli or apollow-codegen
    //   'graphql/template-strings': [
    //     'error',
    //     {
    //       env: 'literal',
    //       projectName: 'eddy-ui',
    //       schemaJsonFilepath: 'node_modules/.temp/graphql/schema.json'
    //     }
    //   ]
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
