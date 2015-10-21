define('app', ['jquery', 'game/core'], function ($, core) {
    var app = {};

    var addPlayer = function (info) {
        var Player = {name: info.name, setControl: function (control) {

                if (info.bot) {
//                  ...
                }
                else {
                    $(document).on('keydown', function (e) {
                        var event = window.event ? window.event : e;
                        console.log("event.keyCode = " + event.keyCode);
                        switch (event.keyCode)
                        {
                            case info.control.fire:
                                control.Fire();
                                break;
                            case info.control.left:
                                control.moveLeft();
                                break;
                            case info.control.up:
                                control.moveUp();
                                break;
                            case info.control.right:
                                control.moveRight();
                                break;
                            case info.control.down:
                                control.moveDown();
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        };
        var id = core.setPlayer(Player);
        console.log('new player', Player.name, 'id', id);
    };


    var player0 = {
        botOrNot: false,
        name: "Yurii",
        control: {
            fire: 96,
            up: 38,
            left: 37,
            down: 40,
            right: 39
        }
    };
    var player1 = {
        botOrNot: false,
        name: "Artik",
        control: {
            fire: 32,
            up: 87,
            left: 65,
            down: 83,
            right: 68
        }
    };

    addPlayer(player0);
    addPlayer(player1);

    return app;
});

