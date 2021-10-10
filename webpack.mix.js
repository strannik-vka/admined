let mix = require('laravel-mix');

mix.options({
    legacyNodePolyfills: false
}).setPublicPath('css');

mix.sass('./scss/index.scss', 'css');