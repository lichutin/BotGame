require.config({
    baseUrl: "js/app",
    paths: {
        'jquery': '../libs/jquery',
        '_':'../libs/lodash.core',
        'botYurii': 'bots/botYurii',
        'botArtik': 'bots/botArtik'
    },
});

require(['app'], function (app) {
});


