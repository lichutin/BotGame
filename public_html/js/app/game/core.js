define(['jquery'], function ($) {
    'use strict';

    var players = [];

    var setPlayer = function (player)
    {
        players.push(player);
        setControl(player);

        var id = players.indexOf(player);
        player.id = id;

        drawPlayer(player);

        return players.indexOf(player);
    };

    var drawPlayer = function (player)
    {
        $('body').append('<div class="gamer" id="player-' + player.id + '">player ' + player.id + '</div>');
    };

    var setControl = function (player)
    {
        var apply = function () {
            $('#player-' + player.id).css('top', position.y);
            $('#player-' + player.id).css('left', position.x);
        };

        var position = {x: 0, y: 0};
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
        };

        player.setControl(control);

    };

    var core = {
        setPlayer: setPlayer,
        startGame: function () {
            return 'game started!';
        }
    };

    return core;
});