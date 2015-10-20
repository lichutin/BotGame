define('app', ['jquery', 'game/core'], function ($, core) {
    var a = 2;

    var app = {};
    app.hello = function () {
        return 'hello, jq is ' + $.fn.jquery;
    };

    var newPlayer = {name: 'Yurii'};

    var id = core.setPlayer(newPlayer);

    console.log('new player', newPlayer.name, 'id',  id);

    return app;
});

