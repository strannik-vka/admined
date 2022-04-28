let mix = require('laravel-mix');

mix.options({
    legacyNodePolyfills: false,
    processCssUrls: false
}).react();

mix.sass('./scss/index.scss', 'css');
mix.js('./src/index.js', 'dist');