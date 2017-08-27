define(['game/core', '_'], function(core, _) {

	var _step = 0,
		_info,
		_self,
		_enemy,
		_direction = 1,
		_enemyShots = [],
		_shotSpeed = 25,
		_shots = {};

	var hitTest = function(x1, y1, size1, x2, y2, size2) {
		var deltaX = x2 - x1;
		var deltaY = y2 - y1;
		return ((deltaX > -size2 && deltaX < size1) && (deltaY > -size2 && deltaY < size1))
	};

	var canIMove = function(nextStep) {
		if (nextStep.x === _enemy.position.xCur && nextStep.x === _enemy.position.yCur) {
			return false;
		}
		return !(nextStep.x < 0 || nextStep.x > 450 || nextStep.y < 0 || nextStep.y > 450)
	};

	var damageForStep = function(nextStep) {
		var x1 = nextStep.x,
			y1 = nextStep.y,
			size1 = _self.size.width;

		return _.filter(_enemyShots, function(shot) {
			var x2 = _shots[shot.id].nextPosition.xCur,
				y2 = _shots[shot.id].nextPosition.yCur,
				size2 = shot.size.width;
			return (hitTest(x1, y1, size1, x2, y2, size2))
		}).length;
	};

	var sortingPositions = function(xCur, yCur) {
		var out = [];
		var positions = [
			{
				x: xCur,
				y: yCur - 50,
				move: core.actionTypes.moveUp
			},
			{
				x: xCur + 50,
				y: yCur,
				move: core.actionTypes.moveRight
			},
			{
				x: xCur,
				y: yCur + 50,
				move: core.actionTypes.moveDown
			},
			{
				x: xCur - 50,
				y: yCur,
				move: core.actionTypes.moveLeft
			}
		];
		var sorting = {};
		sorting[core.actionTypes.moveUp] = [core.actionTypes.moveUp, core.actionTypes.moveLeft, core.actionTypes.moveRight, core.actionTypes.moveDown];
		sorting[core.actionTypes.moveDown] = [core.actionTypes.moveDown, core.actionTypes.moveRight, core.actionTypes.moveLeft, core.actionTypes.moveUp];
		sorting[core.actionTypes.moveLeft] = [core.actionTypes.moveLeft, core.actionTypes.moveDown, core.actionTypes.moveUp, core.actionTypes.moveRight];
		sorting[core.actionTypes.moveRight] = [core.actionTypes.moveRight, core.actionTypes.moveUp, core.actionTypes.moveDown, core.actionTypes.moveLeft];

		var selectedStrategy = sorting[_direction];

		for (var i = 0; i < selectedStrategy.length; i++) {
			var pos = _.find(positions, {move: selectedStrategy[i]});
			out.push(pos);
		}
		return out;
	};

	var damageForMove = function(xCur, yCur) {
		var moves = [];
		var positions = sortingPositions(xCur, yCur);
		for (var i = 0; i < positions.length; i++) {
			moves.push(
				{
					move: positions[i].move,
					newPosition: positions[i],
					damage: damageForStep(positions[i]),
					canIMove: canIMove(positions[i])
				}
			)
		}
		return moves;
	};

	var distance = function(position, target) {
		var deltaX = (target.xCur - position.xCur);
		var deltaY = (target.yCur - position.yCur);
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	};

	var nextBulletPosition = function(position, target, speed) {
		var deltaX = (target.xCur - position.xCur);
		var deltaY = (target.yCur - position.yCur);
		var long = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		var k = 0;
		if (long !== 0) {
			k = speed / long;
		}
		var stepX = k * deltaX;
		var stepY = k * deltaY;

		return {
			xCur: position.xCur + stepX,
			yCur: position.yCur + stepY
		};
	};

	var cleanBullets = function() {
		if (_step % 100 === 0) {
			var currentBullets = _.map(_enemyShots, function(s) {
				return s.id;
			});

			_.forIn(_shots, function(val, key) {
				if (currentBullets.indexOf(parseInt(key)) === -1) {
					delete _shots[key];
				}
			});
		}
	};

	var calcBullets = function() {
		cleanBullets();
		_.forEach(_enemyShots, function(shot) {

			var s = _shots[shot.id];
			if (s) {
				_shots[shot.id].currentPosition.xCur = shot.position.xCur;
				_shots[shot.id].currentPosition.yCur = shot.position.yCur;
				var nextPos = nextBulletPosition(s.currentPosition, s.targetPosition, _shotSpeed);
				_shots[shot.id].nextPosition.xCur = nextPos.xCur;
				_shots[shot.id].nextPosition.yCur = nextPos.yCur;
			} else {
				var next = nextBulletPosition(shot.position, shot.target, _shotSpeed);
				var target = nextBulletPosition(shot.position, shot.target, 500);
				_shots[shot.id] = {
					initialPosition: {
						xCur: shot.position.xCur,
						yCur: shot.position.yCur
					},
					currentPosition: {
						xCur: shot.position.xCur,
						yCur: shot.position.yCur
					},
					nextPosition: {
						xCur: next.xCur,
						yCur: next.yCur
					},
					targetPosition: {
						xCur: target.xCur,
						yCur: target.yCur
					}
				}
			}

		});
	};

	var player = {
		getNextAction: function(info, self) {
			_step++;
			_info = info;
			_self = self;

			_enemy = _.find(_info, function(o) {
				return o.type === 1 && o.id !== _self.id;
			});

			_enemyShots = _.filter(_info, function(o) {
				return o.type === core.gameTypes.bullet && o.pid === _enemy.id;
			});

			calcBullets();

			if (distance(_self.position, _enemy.position) > 50) {
				var damageForStay = damageForStep({
					x: _self.position.xCur,
					y: _self.position.yCur
				});
				if (!damageForStay) {
					return core.actionTypes.fire;
				}
			}

			var dfm = damageForMove(_self.position.xCur, _self.position.yCur);

			dfm = _.chain(dfm).filter({canIMove: true}).map(function(m) {
				m.aftermath = _.minBy(damageForMove(m.newPosition.x, m.newPosition.y), 'damage').damage + m.damage;
				return m;
			}).value();
			if (_.filter(dfm, {damage: 0}).length === dfm.length) {
				return core.actionTypes.fire;
			}

			return _direction = _.minBy(dfm, 'aftermath').move;

		},
		name: 'Artik'
	};

	return player;
});

