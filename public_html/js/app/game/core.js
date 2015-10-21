define(['jquery'], function ($) {
    'use strict';

    var colors = ["#f00", "#ff0"];
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
        var gamer = $("<div />").addClass("gamer").attr("id", "player-"+ player.id)
                .text("Player #"+ player.id).css("background", colors[player.id]);
        $('.battlefield').append(gamer);
    };

    var setControl = function (player)
    {
        var apply = function () {
            if (position.x < 500 && position.y < 500 && position.x >= 0 && position.y >= 0) {
                $('#player-' + player.id).css('top', position.y);
                $('#player-' + player.id).css('left', position.x);
            }
            else if (position.x >= 500) {
                position.x = 450;
            }
            else if (position.y >= 500) {
                position.y = 450;
            }
            else if (position.x < 0){
                position.x = 0;
            }
            else if (position.y < 0){
                position.y = 0;
            }
        };

        var position = {x: 0, y: 0};
        var control = {
            Fire: function(){
              console.log("fire!"); 
            },
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