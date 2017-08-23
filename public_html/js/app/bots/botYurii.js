define(['game/core'], function (core) {
    var shot = false;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var getRandomNumber = function ()
    {
        return getRandomInt(1, 5);
    };

    var _limits = {
        xMax: 450,
        yMax: 450,
        xMin: 0,
        yMin: 0
    };
    var _bulletSpeed = 20;//todo: improve core to give that info
    var _bulletSize = 10;

    var _me;
    var _enemy;
    var _enemyBullets = [];

    var handleGameInfo = function(gameInfo, bot){
        _me = bot;
        _enemy = gameInfo.find(obj => obj.type === core.gameTypes.player && obj.id !== _me.id);

        _enemyBullets.forEach(bullet => bullet.checked = false);

        gameInfo.filter(obj => obj.type === core.gameTypes.bullet && obj.pid === _enemy.id).forEach(bullet => {
            var existing = _enemyBullets.find(eBullet => eBullet.id === bullet.id);
            if(existing){
                existing.prevPosition = existing.position;
                existing.position = bullet.position;
                existing.checked = true;
            } else{
                _enemyBullets.push(bullet);
                bullet.checked = true;
            }
        });
        _enemyBullets.filter(bullet => !bullet.checked).forEach(bullet => {
            var index = _enemyBullets.indexOf(bullet);
            _enemyBullets.splice(index, 1);
        });
    };

    var getNextAction = function(){
        if(isInDanger()) {
            var safestDireaction = getSafestDirection();
            if(safestDireaction !== null){
                return safestDireaction;
            }
        }

        return core.actionTypes.fire;
    };

    var isInDanger = function(){
        //todo: we use only width now, without hight
        var dangerDistance = _me.size.width * 2;

        if(isDangerDistanceToEnemy()){
            if(_me.score > _enemy.score){
                //close to enemy, but our score is higher
                return false;
            }

            return true;
        }

        var isDangerDistanceToBullets = false;
        _enemyBullets.forEach(bullet => {
            if(isDangerDistanceToBullets){
                return;
            }

            var distance = getDistanceToObject(bullet, true);
            if(distance <= dangerDistance){
                isDangerDistanceToBullets = true;
            }
        });

        if(isDangerDistanceToBullets) {
            return true;
        }

        return false;
    };

    var isDangerDistanceToEnemy = function(){
        var dangerDistance = _me.size.width * 2;
        var isDangerDistanceToEnemy = getDistanceToObject(_enemy) <= dangerDistance;

        return isDangerDistanceToEnemy;
    };

    var getDistanceToObject = function(gameObject, inTheFuture){
        var objPosition = inTheFuture 
            ? getNextObjectPosition(gameObject)
            : {x: gameObject.position.xCur, y: gameObject.position.yCur};

        var x = _me.position.xCur - objPosition.x;
        var y = _me.position.yCur - objPosition.y;
        var length = Math.sqrt(x*x + y*y);

        return length;
    };

    var getNextObjectPosition = function(gameObject){
        if(gameObject.type !== core.gameTypes.bullet){
            throw new Exception("not implemented");
        }

        //this calculation is partially taken from core.js 
        var bullet = gameObject;
        var speed = _bulletSpeed;

        var deltaX = bullet.prevPosition 
            ? (bullet.position.xCur -bullet.prevPosition.xCur) 
            : (bullet.target.xCur - bullet.position.xCur);

        var deltaY = bullet.prevPosition 
            ? (bullet.position.yCur - bullet.prevPosition.yCur) 
            : (bullet.target.yCur - bullet.position.yCur); 

        var long = Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
        var k = 0; 
        if (long != 0) {     
            k = speed / long; 
        } 
            
        var stepX = k * deltaX; 
        var stepY = k * deltaY;

        return {
            x: bullet.position.xCur + stepX,
            y: bullet.position.yCur + stepY
        };
    };

    var getSafestDirection = function(){
        if(isDangerDistanceToEnemy()){
            //look at angle of vector from us to enemy
            //invert y to be more mathematics
            var angle = getAngle(_me, _enemy);
            
            var angle45 = 45;
            var angle135 = 135;
            var angle225 = 225;
            var angle315 = 315;

            //todo: handle when we can not move here
            if(angle >= angle45 && angle < angle135){
                return core.actionTypes.moveDown;
            } else if(angle >= angle135 && angle < angle225){
                return core.actionTypes.moveRight;
            } else if(angle >= angle225 && angle < angle315){
                return core.actionTypes.moveUp;
            } else if(angle >= angle315 || angle < angle45){
                return core.actionTypes.moveLeft;
            }
        }

        
        var nextBulletsPositions = _enemyBullets.map(bullet => getNextObjectPosition(bullet));
        //todo: also if bullet is going to hit us - we have to go left/right, not just back
        
        var directions = getPossibleDirectionsForDodge();

        nextBulletsPositions.forEach(position => {
            //todo: use bullet size to get potential hit tests
            var foundDirections = directions.filter(dir => 
                ($in(dir.xMin, dir.xMax, position.x) || $in(dir.xMin, dir.xMax, position.x + _bulletSize)) && 
                ($in(dir.yMin, dir.yMax, position.y) || $in(dir.yMin, dir.yMax, position.y + _bulletSize)))
            .forEach(dir => dir.count++);
        });

        var safestDirection = directions.sort((a, b) => {
            if(a.count < b.count){
                return -1;
            }
            else if (b.count < a.count){
                return 1;
            }
            return 0;
        })[0];

        var stayDirection = directions.find(dir => dir.command === null);

        if(!safestDirection){
            return stayDirection.command;
        }

        if(safestDirection.count === stayDirection.count){
            return stayDirection.command;
        }

        return safestDirection.command;
    };

    var getPossibleDirectionsForDodge = function(){
        var directions = [];
        var mh = _me.size.height;
        var mw = _me.size.width;

        var add = function(command, topLeftX, topLeftY){
            var direction = {
                xMax: topLeftX + mw,
                xMin: topLeftX,
                yMax: topLeftY + mh,
                yMin: topLeftY,
                command: command,
                count: 0
            };

            var isDirectionValid = direction.xMax <= _limits.xMax && direction.xMin >= _limits.xMin
                && direction.yMax <= _limits.yMax && direction.yMin >= _limits.yMin;
            
            if(isDirectionValid){
                directions.push(direction);
            }
        };

        add(core.actionTypes.moveUp, _me.position.xCur, _me.position.yCur - mh);
        add(core.actionTypes.moveDown, _me.position.xCur, _me.position.yCur + mh);
        add(core.actionTypes.moveLeft, _me.position.xCur - mw, _me.position.yCur);
        add(core.actionTypes.moveRight, _me.position.xCur + mw, _me.position.yCur);
        add(null, _me.position.xCur, _me.position.yCur);

        return directions;
    };

    var $in = function(start, end, value){
        if(start > end){
            var temp = start;
            start = end;
            end = temp;
        }

        return value >= start && value <= end;
    };

    var getAngle = function(gameObjA, gameObjB){
        var vector1 = {x: 1, y: 0};
        var vector2 = {x: gameObjB.position.xCur - gameObjA.position.xCur, y: -1 * (gameObjB.position.yCur - gameObjA.position.yCur)};//use -1 to get a math angle

        var scalarMult = (vector1.x * vector2.x + vector1.y * vector2.y);
        var length1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        var length2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

        if(length1 === 0 || length2 === 0){
            return 0;
        }

        var cos = scalarMult / (length1 * length2);
        var acos = Math.acos(cos);
        var degrees = acos * (180 / Math.PI);

        //we get angle from 0 to 180 from acos. Use vector coordinates to get angle from 0 to 360
        if(vector2.y < 0){
            degrees = 360 - degrees;
        }

        return degrees;
    };

    var yurii = {
        //self - info about current bot
        //info - info about all game objects
        getNextAction: function (info, self) {
            handleGameInfo(info, self);
            return getNextAction();
        },
        name: 'Yurii'
    };

    return yurii;
});

