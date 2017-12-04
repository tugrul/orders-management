
var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where all compiled assets will be stored
    .setOutputPath('web/build/')

    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')

    // empty the outputPath dir before each build
    .cleanupOutputBeforeBuild()

    // will output as web/build/app.js
    .addEntry('app', './assets/js/app.jsx')

    // will output as web/build/global.css
    .addStyleEntry('global', './assets/css/global.scss')

    // allow sass/scss files to be processed
    .enableSassLoader()

    .enableReactPreset()

    // allow legacy applications to use $/jQuery as a global variable
//    .autoProvidejQuery()

    .enableSourceMaps(!Encore.isProduction())

    // show OS notifications when builds finish/fail
    .enableBuildNotifications()

    // create hashed filenames (e.g. app.abc123.css)
    // .enableVersioning()
    
    .enableSassLoader(function(sassOptions) {}, {
        resolveUrlLoader: false
    })
;

// export the final configuration
module.exports = Encore.getWebpackConfig();
