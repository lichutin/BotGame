require.config({
    baseUrl: "js/app",
    paths: {
        'jquery': '../libs/jquery'
    },
});

require(['app'], function (app) {
    console.log('hello from app', app.hello());
});


