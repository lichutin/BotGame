define(['game/draw', 'game/base'], function (draw, base) {
    'use strict';

    var gameObjects = [];

    var gameTypes = {
        player: 1,
        bullet: 2
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

        var invokeAction = function (command)
        {
            var apply = function () {
                if (newPlayer.position.xCur < 500 && newPlayer.position.yCur < 500 &&
                        newPlayer.position.xCur >= 0 && newPlayer.position.yCur >= 0) {
                    // draw.player(player);
                }
                else if (newPlayer.position.xCur >= 500) {
                    newPlayer.position.xCur = 450;
                }
                else if (newPlayer.position.yCur >= 500) {
                    newPlayer.position.yCur = 450;
                }
                else if (newPlayer.position.xCur < 0) {
                    newPlayer.position.xCur = 0;
                }
                else if (newPlayer.position.yCur < 0) {
                    newPlayer.position.yCur = 0;
                }

                draw.player(newPlayer);
            };



            var fire = function (fromX, fromY, toX, toY)
            {
                var position = {yCur: fromY, xCur: fromX};
                var target = {yCur: toY, xCur: toX};

                var bullet = createBullet({pid: newPlayer.id, position: position, target: target});
                bullet.fire();
            };

            var preFire = function () {

                var enemy = getEnemy(newPlayer.id);
                if (!enemy)
                    return;

                var target = enemy.position;

                fire(newPlayer.position.xCur + newPlayer.size.width / 2,
                        newPlayer.position.yCur + newPlayer.size.height / 2,
                        target.xCur + enemy.size.width / 2,
                        target.yCur + enemy.size.height / 2);
            };



            var move = function (command) {
                var enemy = getEnemy(newPlayer.id);

                var playerShadow = cloneObject(newPlayer);

                var position = playerShadow.position;

                switch (command) {
                    case actionTypes.moveUp:
                        position.yCur -= 50;
                        break;
                    case actionTypes.moveDown:
                        position.yCur += 50;
                        break;
                    case actionTypes.moveLeft:
                        position.xCur -= 50;
                        break;
                    case actionTypes.moveRight:
                        position.xCur += 50;
                        break;
                    default:
                        break;
                }

                if (!enemy.hitTest(playerShadow)) {
                    newPlayer.position = playerShadow.position;
                }

                apply();
            };


            switch (command)
            {
                case actionTypes.fire:
                    preFire();
                    break;

                default:
                    move(command);
            }
        };

        newPlayer.getNextAction = function () {
            var command = playerInfo.getNextAction();

            if (command)
                invokeAction(command);
        };

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

            bullet.getNextAction = function () {
                return nextAction;
            };
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

    var gameCycle;
    var isGame;

    var startGame = function () {
        if (isGame)
            return;

        var iteration = function () {
            if (!isGame)
                return;

            for (var i = 0; i < gameObjects.length; i++)
            {
                if (!gameObjects[i])
                    continue;

                var action = gameObjects[i].getNextAction();
                action && action();
            }

            setTimeout(iteration, 100);
        };

        isGame = true;
        iteration();
    };

    var stopGame = function () {
        if (gameCycle)
            clearTimeout(gameCycle);

        isGame = false;
    };

    var actionTypes = {
        'moveUp': 1,
        'moveDown': 2,
        'moveLeft': 3,
        'moveRight': 4,
        'fire': 5
    };

    var core = {
        setPlayer: setPlayer,
        startGame: startGame,
        stopGame: stopGame,
        actionTypes: actionTypes
    };
    return core;
});