define(['game/core', '_'], function(core, _) {

	var _step = 0,
		_info,
		_self,
		_enemy,
		_direction = 1;

	var hitTest = function(x1, y1, size1, x2, y2, size2) {
		return ((x1 + size1 >= x2) && (x1 <= x2 + size2) && (y1 + size1 >= y2) && (y1 <= y2 + size2));
	};

	var canIMove = function(nextStep) {
		if (nextStep.x === _enemy.position.xCur && nextStep.x === _enemy.position.yCur) {
			return false;
		}
		return !(nextStep.x < 0 || nextStep.x > 450 || nextStep.y < 0 || nextStep.y > 450)
	};

	var damageForStep = function(nextStep) {
		var enemyShots = _.filter(_info, function(o) {
			return o.type === 2 && o.pid === _enemy.id;
		});
		enemyShots.push(_enemy);

		return _.filter(enemyShots, function(shot) {
			return (hitTest(nextStep.x, nextStep.y, _self.size.width, shot.position.xCur, shot.position.yCur, shot.size.height))
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
		for (var i = 0; i < 4; i++) {
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

	var player = {
		getNextAction: function(info, self) {
			_step++;
			_info = info;
			_self = self;

			_enemy = _.find(_info, function(o) {
				return o.type === 1 && o.id !== _self.id;
			});

			var dfm = damageForMove(self.position.xCur, self.position.yCur);

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

