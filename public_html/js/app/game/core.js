define(['jquery'], function ($) {
    'use strict';

    var colors = ["#f00", "#0f0"];
    var players = [];

    var setPlayer = function (player)
    {
        players.push(player);

        var id = players.indexOf(player);
        player.id = id;

        setControl(player);

        drawPlayer(player);

        return players.indexOf(player);
    };

    var drawPlayer = function (player)
    {
        player.size = 50;
        var gamer = $("<div />").addClass("gamer").attr("id", "player-" + player.id)
                .text(player.name).css("background", colors[player.id]);

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
            else if (position.x < 0) {
                position.x = 0;
            }
            else if (position.y < 0) {
                position.y = 0;
            }
        };

        var getEnemy = function ()
        {
            return players.find(function (item) {
                return item.id != player.id;
            });
        };

        var fire = function (fromX, fromY, toX, toY)
        {
            var position = {y: fromY, x: fromX};
            var bullet = $("<div />").addClass("bullet").attr('data-player', player.id).css({top: position.y, left: position.x, 'background': colors[player.id]}).appendTo($('.battlefield'));

            var speed = 5;

            var deltaX = (toX - fromX);
            var deltaY = (toY - fromY);
            var long = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            var k = 0;

            if (long != 0)
                k = speed / long;

            //10^2 = 
            var stepX = k * deltaX;
            var stepY = k * deltaY;

            var interval = setInterval(function () {
                position.x += stepX;
                position.y += stepY;

                bullet.css({top: position.y, left: position.x});

                if (hitTest())
                    killBullet();

                if (!checkBullet())
                    killBullet();
            }, 50);

            var hitTest = function ()
            {
                var enemy = getEnemy();
                if (!enemy)
                    return;

                var enemyPos = enemy.getPosition();

                var deltaX = enemyPos.x - position.x;
                var deltaY = enemyPos.y - position.y;

                if ((deltaX >= -50 && deltaX <= 0) && (deltaY >= -50 && deltaY <= 0))
                    return true;

                return false;
            };

            var checkBullet = function ()
            {
                if (position.x >= 500 || position.x <= 0 || position.y >= 500 || position.y <= 0)
                    return false;

                return true;
            }

            var killBullet = function () {
                clearInterval(interval);
                bullet.remove();
            };
//            bullet.animate({"top": toY, "left": toX}, 500, function () {
//                bullet.remove();
//            });

            console.log('from ', fromX, fromY, 'to ', toX, toY);
        };

        var position = {x: 0, y: 0};

        player.getPosition = function () {
            return position;
        };

        var control = {
            fire: function () {
                var enemy = getEnemy();

                if (!enemy)
                    return;

                var target = enemy.getPosition();

                fire(position.x + player.size / 2, position.y + player.size / 2, target.x + enemy.size / 2, target.y + enemy.size / 2);
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