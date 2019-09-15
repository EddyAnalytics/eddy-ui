const path = require('path');

// Load .env files
const { loadEnv } = require('vue-cli-plugin-apollo/utils/load-env');
const env = loadEnv([path.resolve(__dirname, '.env'), path.resolve(__dirname, '.env.local')]);

module.exports = {
    client: {
        includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql}'],
        service: {
            name: env.APOLLO_ENGINE_SERVICE,
            localSchemaFile: 'src/graphql/schema.json',
        },
    },
    service: {
        name: env.APOLLO_ENGINE_SERVICE,
        endpoint: {
            url: 'http://localhost:8000',
            headers: {
                authorization: 'Bearer token',
            },
            skipSSLValidation: true,
        },
    },
    engine: {
        apiKey: env.APOLLO_ENGINE_KEY,
    },
};
