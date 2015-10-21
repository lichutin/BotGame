define('app', ['jquery', 'game/core'], function ($, core) {
    var app = {};



    var addPlayer = function (info) {

        var player = {name: info.name, setControl: function (control) {
                if (info.bot) {
//                  ...
                }
                else {
                    var keys = [];


                    $(document).on('keyup', function (e) {
                        var event = window.event ? window.event : e;
                        keys[event.keyCode] = false;
                    });

                    var handle = function () {
                        if (keys[info.control.fire])
                            control.fire();

                        if (keys[info.control.left])
                            control.moveLeft();

                        if (keys[info.control.up])
                            control.moveUp();

                        if (keys[info.control.right])
                            control.moveRight();

                        if (keys[ info.control.down])
                            control.moveDown();
                    };

                    $(document).on('keydown', function (e) {
                        var event = window.event ? window.event : e;
                        keys[event.keyCode] = true;


                        handle();

                    });
                }
            }
        };
        var id = core.setPlayer(player);
        console.log('new player', player.name, 'id', id);
    };


    var player0 = {
        bot: false,
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
        bot: false,
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

