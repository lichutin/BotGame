define(['game/core', '_'], function (core, _) {

    var nextPositions = {
        top: {
            x: 0,
            y: 0,
            good: false
        },
        right: {
            x: 0,
            y: 0,
            good: false
        },
        left: {
            x: 0,
            y: 0,
            good: false
        },
        bottom: {
            x: 0,
            y: 0,
            good: false
        },
    };

    var hitTest = function (x1, y1, size1, x2, y2, size2) {
        return (x1 <= x2 && x1 + size1 >= x2 + size2 && y1 <= y2 && y1 + size1 >= y2 + size2);
    }

    var analyzePosition = function (objects, me) {
        var enemy = _.find(objects, function (o) {
            return o.type === 1 && o.id !== me.id;
        });
        var enemyShots = _.filter(objects, function (o) {
            return o.type == 2 && o.pid === enemy.id;
        });
        enemyShots.push({
            id: enemy.id,
            position: enemy.position,
            size: enemy.size
        })
        // console.log(myId, enemyId)
        console.log(objects)

        var delta = 50;
        var distance = 50;
        var hitArea = me.size.width * 2.2;
        var upCenter = (hitArea - me.size.width) / 2;

        nextPositions.top.x = me.position.xCur;
        nextPositions.top.y = me.position.yCur - delta;
        nextPositions.top.good = true;

        nextPositions.right.x = me.position.xCur + delta;
        nextPositions.right.y = me.position.yCur;
        nextPositions.right.good = true;

        nextPositions.left.x = me.position.xCur - delta;
        nextPositions.left.y = me.position.yCur;
        nextPositions.left.good = true;

        nextPositions.bottom.x = me.position.xCur;
        nextPositions.bottom.y = me.position.yCur + delta;
        nextPositions.bottom.good = true;

        _.forEach(enemyShots, function (shot) {
            if (hitTest(me.position.xCur - upCenter, me.position.yCur - upCenter - distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)) {
                nextPositions.top.good = false;
            }
            if (hitTest(me.position.xCur - upCenter + distance, me.position.yCur - upCenter, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)) {
                nextPositions.right.good = false;
            }
            if (hitTest(me.position.xCur - upCenter, me.position.yCur - upCenter + distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)) {
                nextPositions.bottom.good = false;
            }
            if (hitTest(me.position.xCur - upCenter - distance, me.position.yCur - upCenter, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)) {
                nextPositions.left.good = false;
            }
        });

        if (me.position.yCur <= 0) {
            nextPositions.top.good = false;
        }
        if (me.position.xCur >= 450) {
            nextPositions.right.good = false;
        }
        if (me.position.yCur >= 450) {
            nextPositions.bottom.good = false;
        }
        if (me.position.xCur <= 0) {
            nextPositions.left.good = false;
        }



        // console.log({
        //     top: nextPositions.top.good,
        //     right: nextPositions.right.good,
        //     bottom: nextPositions.bottom.good,
        //     left: nextPositions.left.good,
        // })
    }

    var player = {
        getNextAction: function (info, self) {
            // console.log('that`s me', self);
            // console.log('game objects', info);
            analyzePosition(info, self);

            if (nextPositions.top.good && nextPositions.right.good && nextPositions.bottom.good && nextPositions.left.good) {
                return core.actionTypes.fire;
            }
            if (nextPositions.top.good && !nextPositions.bottom.good) {
                return core.actionTypes.moveUp
            }
            if (nextPositions.right.good && !nextPositions.left.good) {
                return core.actionTypes.moveRight
            }
            if (nextPositions.bottom.good && !nextPositions.top.good) {
                return core.actionTypes.moveDown
            }
            if (nextPositions.left.good && !nextPositions.right.good) {
                return core.actionTypes.moveLeft
            }

            return core.actionTypes.fire;

        },
        name: 'Artik'
    };

    return player;
});

