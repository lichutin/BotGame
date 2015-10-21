define(['jquery'], function ($) {
    'use strict';
    var colors = ["#f00", "#0f0", "#00f", "#fa0"];
    var defaultcoords = [
        {x: 0, y: 0},
        {x: 450, y: 450},
        {x: 450, y: 0},
        {x: 0, y: 450}
    ];

    var players = [];
    var setPlayer = function (player)
    {
        players.push(player);
        var id = players.indexOf(player);
        player.id = id;
        player.score = 0;
        setControl(player);
        drawPlayer(player);
        return players.indexOf(player);
    };
    var drawPlayer = function (player)
    {
        var pid = player.id;
        player.size = 50;
        var gamer = $("<div />").addClass("gamer").attr("id", "player-" + pid).text(player.name)
                .css({
                    "background": colors[pid],
                    "top": defaultcoords[pid].x,
                    "left": defaultcoords[pid].y
                });
        var score = $("<div />").addClass("score").text(player.name + ": ");
        var label = $("<label />").attr("id", "score-" + pid).text("0");
        score.append(label);
        $('.battlefield').append(gamer);
        $(".score-table").append(score);
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
            var bullet = $("<div />").addClass("bullet").attr('data-player', player.id)
                    .css({top: position.y, left: position.x, 'background': colors[player.id]})
                    .appendTo($('.battlefield'));
            var speed = 25;
            var deltaX = (toX - fromX);
            var deltaY = (toY - fromY);
            var long = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var k = 0;
            if (long != 0)
                k = speed / long;
            var stepX = k * deltaX;
            var stepY = k * deltaY;
            var interval = setInterval(function () {
                position.x += stepX;
                position.y += stepY;
                bullet.css({top: position.y, left: position.x});
                if (hitTest()) {
                    killBullet();
                    player.score++;
                    $("#score-" + player.id).text(player.score);
                }
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
            };
            var killBullet = function () {
                clearInterval(interval);
                bullet.remove();
            };
            console.log('from ', fromX, fromY, 'to ', toX, toY);
        };
        var position = {x: defaultcoords[player.id].x, y: defaultcoords[player.id].y};
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
                move("up");
            },
            moveDown: function () {
                move("down");
            },
            moveLeft: function () {
                move("left");
            },
            moveRight: function () {
                move("right");
            }
        };
        var move = function (to) {
            var enemy = getEnemy();
            if (!enemy)
                return;
            var target = enemy.getPosition();

            switch (to) {
                case "up":
                    position.y -= 50;
                    if (position.x === target.x && position.y === target.y) {
                        position.y += 50;
                    }
                    break;
                case "down":
                    position.y += 50;
                    if (position.x === target.x && position.y === target.y) {
                        position.y -= 50;
                    }
                    break;
                case "left":
                    position.x -= 50;
                    if (position.x === target.x && position.y === target.y) {
                        position.x += 50;
                    }
                    break;
                case "right":
                    position.x += 50;
                    if (position.x === target.x && position.y === target.y) {
                        position.x -= 50;
                    }
                    break;
                default:
                    break;
            }

            apply();
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