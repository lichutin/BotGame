define(['game/draw', 'game/base'], function (draw, base) {
    'use strict';

    var gameObjects = [];

    var gameTypes = {
        player: 1,
        bullet: 2
    };

    var directions = {
        up: 1,
        down: 2,
        left: 3,
        right: 4
    };

    var defaultCoords = [
        {xCur: 0, yCur: 0, xNext: 0, yNext: 0},
        {xCur: 450, yCur: 450, xNext: 0, yNext: 0},
        {xCur: 450, yCur: 0, xNext: 0, yNext: 0},
        {xCur: 0, yCur: 450, xNext: 0, yNext: 0}
    ];

    var createObject = function (obj)
    {
        gameObjects.push(obj);
        obj.id = gameObjects.indexOf(obj);
        return obj.id;
    };

    var getPlayer = function (id)
    {
        return gameObjects.find(function (item) {
            return item.type === gameTypes.player && item.id === id;
        });
    };

    var createPlayer = function (playerInfo) {
        var newPlayer = base.createObject();

        newPlayer.type = gameTypes.player;
        newPlayer.score = 0;
        newPlayer.size = {width: 50, height: 50};


        newPlayer.name = playerInfo.name;

        createObject(newPlayer);
        newPlayer.position = defaultCoords[newPlayer.id];

        draw.player(newPlayer);
        draw.score(newPlayer);

        var setControl = function (player)
        {
            var apply = function () {
                if (player.position.xCur < 500 && player.position.yCur < 500 &&
                        player.position.xCur >= 0 && player.position.yCur >= 0) {
                    // draw.player(player);
                }
                else if (player.position.xCur >= 500) {
                    player.position.xCur = 450;
                }
                else if (player.position.yCur >= 500) {
                    player.position.yCur = 450;
                }
                else if (player.position.xCur < 0) {
                    player.position.xCur = 0;
                }
                else if (player.position.yCur < 0) {
                    player.position.yCur = 0;
                }

                draw.player(player);
            };



            var fire = function (fromX, fromY, toX, toY)
            {
                var position = {yCur: fromY, xCur: fromX};
                var target = {yCur: toY, xCur: toX};

                var bullet = createBullet({pid: player.id, position: position, target: target});
                bullet.fire();
            };

            var control = {
                fire: function () {
                    var enemy = getEnemy(player.id);
                    if (!enemy)
                        return;

                    var target = enemy.position;

                    fire(player.position.xCur + player.size.width / 2,
                            player.position.yCur + player.size.height / 2,
                            target.xCur + enemy.size.width / 2,
                            target.yCur + enemy.size.height / 2);
                },
                moveUp: function () {
                    move(directions.up);
                },
                moveDown: function () {
                    move(directions.down);
                },
                moveLeft: function () {
                    move(directions.left);
                },
                moveRight: function () {
                    move(directions.right);
                }
            };
            var move = function (to) {
                var enemy = getEnemy(player.id);

                var playerShadow = cloneObject(player);

                var position = playerShadow.position;

                switch (to) {
                    case directions.up:
                        position.yCur -= 50;
                        break;
                    case directions.down:
                        position.yCur += 50;
                        break;
                    case directions.left:
                        position.xCur -= 50;
                        break;
                    case directions.right:
                        position.xCur += 50;
                        break;
                    default:
                        break;
                }

                if (!enemy.hitTest(playerShadow)) {
                    player.position = playerShadow.position;
                }

                apply();
            };

            playerInfo.setControl(control);
        };

        setControl(newPlayer);

        newPlayer.invokeNextAction = playerInfo.invokeNextAction;

        return newPlayer;
    };

    var createBullet = function (bulletInfo)
    {
        var bullet = base.createObject();
        bullet.type = gameTypes.bullet;
        bullet.pid = bulletInfo.pid;
        bullet.position = bulletInfo.position;
        bullet.target = bulletInfo.target;

        bullet.size = {width: 10, height: 10};

        createObject(bullet);

        var interval;

        bullet.fire = function () {
            draw.bullet(bullet);

            var speed = 20;
            var deltaX = (bullet.target.xCur - bullet.position.xCur);
            var deltaY = (bullet.target.yCur - bullet.position.yCur);
            var long = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var k = 0;
            if (long != 0)
                k = speed / long;
            var stepX = k * deltaX;
            var stepY = k * deltaY;

            var nextAction = function ()
            {
                bullet.position.xCur += stepX;
                bullet.position.yCur += stepY;

                draw.bullet(bullet);

                var enemy = getEnemy(bullet.pid);

                if (bullet.hitTest(enemy)) {
                    killBullet();

                    var player = getPlayer(bulletInfo.pid);
                    player.score++;
                    draw.score(player);
                }
                if (!checkBullet())
                    killBullet();
            };

            bullet.invokeNextAction = function () {
                nextAction();
            };
//            interval = setInterval(function () {
//                bullet.position.xCur += stepX;
//                bullet.position.yCur += stepY;
//
//                draw.bullet(bullet);
//
//                var enemy = getEnemy(bullet.pid);
//
//                if (bullet.hitTest(enemy)) {
//                    killBullet();
//
//                    var player = getPlayer(bulletInfo.pid);
//                    player.score++;
//                    draw.score(player);
//                }
//                if (!checkBullet())
//                    killBullet();
//            }, 50);
        };



        var checkBullet = function ()
        {
            if (bullet.position.xCur >= 500 || bullet.position.xCur <= 0 ||
                    bullet.position.yCur >= 500 || bullet.position.yCur <= 0)
                return false;

            return true;
        };

        var killBullet = function () {
            //todo: implement
            if (interval)
                clearInterval(interval);

            draw.remove(bullet);
        };

        return bullet;
    };

    var setPlayer = function (playerInfo)
    {
        var player = createPlayer(playerInfo);

        return player.id;
    };

    var cloneObject = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    var getEnemy = function (id)
    {
        return gameObjects.find(function (item) {
            return item.id !== id && item.type === gameTypes.player;
        });
    };

    var startGame = function () {
        var iteration = function () {
            for (var i = 0; i < gameObjects.length; i++)
            {
                if (!gameObjects[i])
                    continue;

                //todo: подуматЬ ,как можно запретить выполнять за ход больше одного действия
                //возможно, управление через контрол уже устарело
                var action = gameObjects[i].invokeNextAction();
//                action && action();
            }

            setTimeout(iteration, 100);
        };

        iteration();
    };

    var core = {
        setPlayer: setPlayer,
        startGame: startGame
    };
    return core;
});