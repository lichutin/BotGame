define('app', ['jquery', 'game/core'], function ($, core) {
    var a = 2;

    var app = {};

    var AddPlayer = function (info) {
        var Player = {name: info.name, setControl: function (control) {
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
            }};
        var id = core.setPlayer(Player);
        console.log('new player', Player.name, 'id', id);
    };


    var yurii = {
        name: "Yurii",
        control: {
            fire: 96,
            up: 38,
            left: 37,
            down: 40,
            right: 39
        }
    };
    var artik = {
        name: "Artik",
        control: {
            fire: 32,
            up: 87,
            left: 65,
            down: 83,
            right: 68
        }
    };

    AddPlayer(yurii);
    AddPlayer(artik);

    return app;
});

