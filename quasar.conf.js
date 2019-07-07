// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel'
      ],

      directives: [
        'Ripple'
      ],

      // Quasar plugins
      plugins: [
        'Notify'
      ]
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        // Show eslint errors in browser(?)
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
        /* ISSUE_HERE (1/3)
        Comment out the rest of this function to experience:

        Error: Local data URIs are not supported: player

        Phaser wants to load resources over XHR, so would like URL instead.
        This error happens because webpack made the file a dataurl.

        The code below is my attempt to configure webpack to process these
        files so they can be loaded via XHR
        */

        // Find babel-loader because I heard it makes a difference
        let r = cfg.module.rules
        const index = r.findIndex(rule => {
          return (rule && rule.use) ? rule.use.loader === 'babel-loader' : false
        }) || 0

        // Insert these after the babel-loader because it might make a difference:
        // https://stackoverflow.com/a/45428153/1483977
        r.splice(index + 1, 0, {
          include: /src\/games/,
          test: [/\.vert$/i, /\.frag$/i],
          use: 'raw-loader'
        },
        {
          include: /src\/games/,
          test: /\.(gif|png|jpe?g|svg|xml|mp3)$/i,
          use: 'file-loader'
        }
        )
        console.log(cfg)
        cfg.module.rules.forEach(rule => {
          console.log(rule)
        })

        /* ISSUE_HERE
        Webpack created these files (output in browser console)
        ```
        1b7d460ae0a1b62ad310366012bc4e20.png
        c5b05634518f62135bc6b754594d352c.png
        85b0e130bbe4ecce34b3ee50f6596906.png
        f36c557a87c9f3eb8a7e12c729e50d9a.png
        ```
        but the file contents are text:

        ```
        $ curl --insecure https://localhost:8080/1b7d460ae0a1b62ad310366012bc4e20.png
        module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABICAYAAABGOvOzAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QYRAzcI6rMxggAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACuUlEQVR42u2cT2gTQRTGZ1Wo0qZIkAqhWC0ELWJBGlSK6EEUqSjiQcFS/6FFsaWgQtrQq2hAL1oQ/1Wk6kFEGhuLeggKYlDbWwWbhFxEGlsNGKu0B7te++3hLePsYqXfu33MzNvdX957OzO7G8u2bWVilmUZObBt2/LyeLr+Fqh5bgQw3wEsMs350olasf/U7mbQiwfui/50czgWixn5YwoQAGuAtzkfONkGunxyBok72kuqx9OakMlktPwxBQiANcAs560Dh1E3nAH9JdEJevnWi2J7ST00WmuEw2FGAAEQgI9rgUBbB+gfheKcuqBsNssIIAAC0KgBuvf9RPQ86G3nToP+/SYujndr/8kIIAACmFPzgNSnSTlnp6dB37uaEvu3RpvE9sqbeSWt3501KxQKMQIIgAD+3iylFORU/84q6LD32bjoYORuO+i6cLXWCSxsjGr1723eBfrx22Gx/76NDaCPP0oxAgiAAGbVAOf7Ac777O0tuMdWXYc5lS+MiQfYcTAC+sWDIbH/qcQrf3/xsiWMAAIgAGE/IH3lKHTYEFkD+kZ8EHRZRQXo+gjm/K0k5nSkFvcbVtbUYA2YwbVHT9d+0E1n+0APXm4B/X54FPSm9l7cj5j6xWeDBEAAGvsBTnv6YVSca+dzOdAX+l7i+O51oAtfv4G+NoBz+0Pb68XzeTf0kRFAAATg4X6A2zzAuX5fuywAetXSctCbg0HQr4v4LDGZK/h6gXxPkClAAN7OA/w2r78fYAQQAAHINcDt2ZvTPvd3ig6f3EmD/j42Afr6pSNaOe1WE3RrBiOAAAhAngfo1oRj8STo5+kR8YAtao84nhFAAATwf60FxoslX8ebfkPECCAAApBTzO3/A5w5uH71CmivClaK453zAtPxrAFMAQL4tzVA13TXFrr+GAEEQABG9gfGHunDQfvhPQAAAABJRU5ErkJggg=="%
        ```

        Even when "built" to files
        ```
        $ quasar dev
        $ cat test/dist/spa/1b7d460ae0a1b62ad310366012bc4e20.png)

        module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABICAYAAABGOvOzAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QYRAzcI6rMxggAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACuUlEQVR42u2cT2gTQRTGZ1Wo0qZIkAqhWC0ELWJBGlSK6EEUqSjiQcFS/6FFsaWgQtrQq2hAL1oQ/1Wk6kFEGhuLeggKYlDbWwWbhFxEGlsNGKu0B7te++3hLePsYqXfu33MzNvdX957OzO7G8u2bWVilmUZObBt2/LyeLr+Fqh5bgQw3wEsMs350olasf/U7mbQiwfui/50czgWixn5YwoQAGuAtzkfONkGunxyBok72kuqx9OakMlktPwxBQiANcAs560Dh1E3nAH9JdEJevnWi2J7ST00WmuEw2FGAAEQgI9rgUBbB+gfheKcuqBsNssIIAAC0KgBuvf9RPQ86G3nToP+/SYujndr/8kIIAACmFPzgNSnSTlnp6dB37uaEvu3RpvE9sqbeSWt3501KxQKMQIIgAD+3iylFORU/84q6LD32bjoYORuO+i6cLXWCSxsjGr1723eBfrx22Gx/76NDaCPP0oxAgiAAGbVAOf7Ac777O0tuMdWXYc5lS+MiQfYcTAC+sWDIbH/qcQrf3/xsiWMAAIgAGE/IH3lKHTYEFkD+kZ8EHRZRQXo+gjm/K0k5nSkFvcbVtbUYA2YwbVHT9d+0E1n+0APXm4B/X54FPSm9l7cj5j6xWeDBEAAGvsBTnv6YVSca+dzOdAX+l7i+O51oAtfv4G+NoBz+0Pb68XzeTf0kRFAAATg4X6A2zzAuX5fuywAetXSctCbg0HQr4v4LDGZK/h6gXxPkClAAN7OA/w2r78fYAQQAAHINcDt2ZvTPvd3ig6f3EmD/j42Afr6pSNaOe1WE3RrBiOAAAhAngfo1oRj8STo5+kR8YAtao84nhFAAATwf60FxoslX8ebfkPECCAAApBTzO3/A5w5uH71CmivClaK453zAtPxrAFMAQL4tzVA13TXFrr+GAEEQABG9gfGHunDQfvhPQAAAABJRU5ErkJggg=="%
        ```

        Which is a long long way to go to get the wrong thing :-)
        */
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar App',
        // description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'test'
      }
    }
  }
}
