define('app', ['jquery', 'game/core'], function ($, core) {
    var a = 2;

    var app = {};

    var newPlayer = {name: 'Yurii', setControl: function (control) {
            $(document).on('keydown', function (e) {
                var event = window.event ? window.event : e;
                switch (event.keyCode)
                {
                    case 37:
                        control.moveLeft();
                        break;
                    case 38:
                        control.moveUp();
                        break;
                    case 39:
                        control.moveRight();
                        break;
                    case 40:
                        control.moveDown();
                        break;
                    default:
                        break;
                }
            });
        }};

    var id = core.setPlayer(newPlayer);

    console.log('new player', newPlayer.name, 'id', id);

    return app;
});

