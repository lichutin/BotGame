define(['jquery'], function ($) {
    var players = [];

    /*
     * Game core
     * @type type
     */
    var core = {
        /*
         * Return an player's id
         */
        setPlayer: function (player) {
            players.push(player);
            player.setControl(control);
            return players.indexOf(player);
        },
        startGame: function () {
            return 'game started!';
        }
    };

    var position = {x: 0, y: 0};

    var apply = function () {
        $('#player-0').css('top', position.y);
        $('#player-0').css('left', position.x);
    };

    var control = {
        moveUp: function () {
            position.y -= 50;
            apply();
        },
        moveDown: function () {
            position.y += 50;
            apply();

        },
        moveLeft: function () {
            position.x -= 50;
            apply();

        },
        moveRight: function () {
            position.x += 50;
            apply();
        }
    }

    return core;
});