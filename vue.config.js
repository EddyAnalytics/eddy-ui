// Version used for forcing file cache invalidation in exceptional cases
const VERSION = '1';

module.exports = {
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true,
        },
    },

    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // Add version suffix to file names to force cache invalidation (CDN, Browser, and SW) in exceptional cases
            config.output.filename(`js/[name].[contenthash:8].v${VERSION}.js`);
            config.output.chunkFilename(`js/[name].[contenthash:8].v${VERSION}.js`);
        }
    },

    css: {
        loaderOptions: {
            sass: {
                data: `
                  @import "@/assets/css/general/settings.scss";
                  @import "@/assets/css/general/mixins.scss";
                `,
            },
        },
        extract:
            process.env.NODE_ENV === 'production'
                ? {
                      filename: `css/[name].[contenthash:8].v${VERSION}.css`,
                      chunkFilename: `css/[name].[contenthash:8].v${VERSION}.css`,
                  }
                : undefined,
    },

    pluginOptions: {
      apollo: {
        enableMocks: true,
        enableEngine: true
      }
    }
};
