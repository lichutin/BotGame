define(['game/core', '_'], function (core, _) {
    // var me,
    //     enemy,
    //     bullets = [],
    //     canIStayHere = true;

    // var nextPositions = {
    //     top: {
    //         x: 0,
    //         y: 0,
    //         good: false
    //     },
    //     right: {
    //         x: 0,
    //         y: 0,
    //         good: false
    //     },
    //     left: {
    //         x: 0,
    //         y: 0,
    //         good: false
    //     },
    //     bottom: {
    //         x: 0,
    //         y: 0,
    //         good: false
    //     },
    // };

    var hitTest = function (x1, y1, size1, x2, y2, size2) {
        return ((x1 + size1 >= x2) && (x1 <= x2 + size2) && (y1 + size1 >= y2) && (y1 <= y2 + size2));
    }

    var damageForStep = function (objects, _me, nextStep) {
        me = _me;
        enemy = _.find(objects, function (o) {
            return o.type === 1 && o.id !== me.id;
        });
        if (nextStep.x < 0 || nextStep.x > 450 || nextStep.y < 0 || nextStep.y > 450) {
            return 1000;
        }
        if (nextStep.x == enemy.position.xCur && nextStep.x == enemy.position.yCur) {
            return 1000;
        }
        var enemyShots = _.filter(objects, function (o) {
            return o.type == 2 && o.pid === enemy.id;
        });

        return _.filter(enemyShots, function (shot) {
            return (hitTest(nextStep.x, nextStep.y, me.size.width, shot.position.xCur, shot.position.yCur, shot.size.height))
        }).length;
    }

    var analyzePosition = function (objects, _me) {
        me = _me;
        enemy = _.find(objects, function (o) {
            return o.type === 1 && o.id !== me.id;
        });
        var enemyShots = _.filter(objects, function (o) {
            return o.type == 2 && o.pid === enemy.id;
        });
        bullets = enemyShots;
        enemyShots.push({
            id: enemy.id,
            position: enemy.position,
            size: enemy.size
        })
        // console.log(myId, enemyId)
        // console.log(objects)

        var distance = 50;
        var hitArea = me.size.width;

        nextPositions.top.x = me.position.xCur;
        nextPositions.top.y = me.position.yCur - distance;
        nextPositions.top.good = true;

        nextPositions.right.x = me.position.xCur + distance;
        nextPositions.right.y = me.position.yCur;
        nextPositions.right.good = true;

        nextPositions.bottom.x = me.position.xCur;
        nextPositions.bottom.y = me.position.yCur + distance;
        nextPositions.bottom.good = true;

        nextPositions.left.x = me.position.xCur - distance;
        nextPositions.left.y = me.position.yCur;
        nextPositions.left.good = true;

        canIStayHere = true;

        _.forEach(enemyShots, function (shot) {
            if (nextPositions.top.good && hitTest(nextPositions.top.x, nextPositions.top.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)) {
                nextPositions.top.good = false;
            }
            if (nextPositions.right.good && hitTest(nextPositions.right.x, nextPositions.right.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)) {
                nextPositions.right.good = false;
            }
            if (nextPositions.bottom.good && hitTest(nextPositions.bottom.x, nextPositions.bottom.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)) {
                nextPositions.bottom.good = false;
            }
            if (nextPositions.left.good && hitTest(nextPositions.left.x, nextPositions.left.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)) {
                nextPositions.left.good = false;
            }


            if (canIStayHere) {
                if (hitTest(me.position.xCur - distance, me.position.yCur - distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)
                    || hitTest(me.position.xCur + distance, me.position.yCur - distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)
                    || hitTest(me.position.xCur - distance, me.position.yCur + distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)
                    || hitTest(me.position.xCur + distance, me.position.yCur + distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)
                    || hitTest(nextPositions.top.x, nextPositions.top.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)
                    || hitTest(nextPositions.right.x, nextPositions.right.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)
                    || hitTest(nextPositions.bottom.x, nextPositions.bottom.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height)
                    || hitTest(nextPositions.left.x, nextPositions.left.y, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)) {
                    canIStayHere = false;
                }
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

    }

    // var needToRun = false;
    // var needToRunSteps = 0;
    // var needToRunMove = 1;

    var player = {
        getNextAction: function (info, self) {
            // if (needToRun) {
            //     if (needToRunSteps) {
            //         needToRunSteps--;
            //         console.log('run')
            //         return needToRunMove;
            //     } else {
            //         needToRun = false
            //     }
            // }

            // var letsRun = false;
            // var distance = 50;
            // var hitArea = 50;

            // var f = _.filter(info, function (o) {
            //     return o.id != self.id;
            // })
            // _.forEach(f, function (shot) {
            //     if (!letsRun) {
            //         if (hitTest(self.position.xCur - distance, self.position.yCur - distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height) ||
            //             hitTest(self.position.xCur + distance, self.position.yCur - distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height) ||
            //             hitTest(self.position.xCur - distance, self.position.yCur + distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height) ||
            //             hitTest(self.position.xCur + distance, self.position.yCur + distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height) ||
            //             hitTest(self.position.xCur - distance, self.position.yCur, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height) ||
            //             hitTest(self.position.xCur + distance, self.position.yCur, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width) ||
            //             hitTest(self.position.xCur, self.position.yCur - distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.height) ||
            //             hitTest(self.position.xCur, self.position.yCur + distance, hitArea, shot.position.xCur, shot.position.yCur, shot.size.width)) {
            //             letsRun = true;
            //         }
            //     }
            // });
            var damageForMove = [
                {
                    move: core.actionTypes.moveUp,
                    damage: damageForStep(info, self, {
                        x: self.position.xCur,
                        y: self.position.yCur - 50
                    })
                },
                {
                    move: core.actionTypes.moveRight,
                    damage: damageForStep(info, self, {
                        x: self.position.xCur + 50,
                        y: self.position.yCur
                    })
                },
                {
                    move: core.actionTypes.moveDown,
                    damage: damageForStep(info, self, {
                        x: self.position.xCur,
                        y: self.position.yCur + 50
                    })
                },
                {
                    move: core.actionTypes.moveLeft,
                    damage: damageForStep(info, self, {
                        x: self.position.xCur - 50,
                        y: self.position.yCur
                    })
                },
            ];

            var allMinimals = _.filter(damageForMove, { damage: 0 }).length === 4;
            if (allMinimals) {
                console.log('fire!')
                return core.actionTypes.fire;
            }

            damageForMove = _.shuffle(damageForMove);
            var min = _.minBy(damageForMove, 'damage');

            console.warn('minimumDamage:', min.damage);
            return min.move;

            // return min.move;

            // if (nextPositions.top.good && !nextPositions.bottom.good) {
            //     return core.actionTypes.moveUp
            // }
            // if (nextPositions.right.good && !nextPositions.left.good) {
            //     return core.actionTypes.moveRight
            // }
            // if (nextPositions.bottom.good && !nextPositions.top.good) {
            //     return core.actionTypes.moveDown
            // }
            // if (nextPositions.left.good && !nextPositions.right.good) {
            //     return core.actionTypes.moveLeft
            // }



            // var deltaTop = me.position.yCur,
            //     deltaBottom = 450 - me.position.yCur,
            //     deltaLeft = me.position.xCur,
            //     deltaRight = 450 - me.position.xCur;

            // if (nextPositions.top.good) {
            //     return core.actionTypes.moveUp
            // }
            // if (nextPositions.bottom.good) {
            //     return core.actionTypes.moveDown
            // }
            // if (nextPositions.left.good) {
            //     return core.actionTypes.moveLeft
            // }
            // if (nextPositions.right.good) {
            //     return core.actionTypes.moveRight
            // }









            // var assumption = 100;

            // if (deltaTop > deltaBottom + assumption) {
            //     return core.actionTypes.moveUp
            // }
            // if (deltaBottom > deltaTop + assumption) {
            //     return core.actionTypes.moveDown
            // }
            // if (deltaLeft > deltaRight + assumption) {
            //     return core.actionTypes.moveLeft
            // }
            // if (deltaRight > deltaLeft + assumption) {
            //     return core.actionTypes.moveRight
            // }


            // if (me.position.xCur >= 450 && me.position.yCur <= 0) {
            //     var factor = (me.position.xCur - enemy.position.xCur) - (me.position.yCur - enemy.position.yCur);
            //     if (factor > 0) {
            //         return core.actionTypes.moveDown;
            //     } else {
            //         return core.actionTypes.moveLeft;
            //     }
            // }
            console.warn('UNEXCEPTED STEP')
            return core.actionTypes.fire;

        },
        name: 'Artik'
    };

    return player;
});

