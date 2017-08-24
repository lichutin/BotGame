require.config({
    baseUrl: "js/app",
    paths: {
        'jquery': '../libs/jquery',
        '_':'../libs/lodash.core',
        'botYurii': 'bots/botYurii',
        'botArtik': 'bots/botArtik',
        'botRandom': 'bots/botRandom'
    },
});

require(['app'], function (app) {
});


