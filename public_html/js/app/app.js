define('app', ['jquery', 'game/core', 'botArtik', 'botYurii', 'botRandom'], function($, core, artik, yurii, botRandom) {
	var app = {};

	var actionTypes = core.actionTypes;

	var addPlayer = function(info) {
		var command;

		var setup = function() {
			var keys = [];

			$(document).on('keyup', function(e) {
				var event = window.event ? window.event : e;
				keys[event.keyCode] = false;
			});

			var handle = function() {
				if (keys[info.control.fire])
					command = actionTypes.fire;

				if (keys[info.control.left])
					command = actionTypes.moveLeft;

				if (keys[info.control.up])
					command = actionTypes.moveUp;

				if (keys[info.control.right])
					command = actionTypes.moveRight;

				if (keys[info.control.down])
					command = actionTypes.moveDown;

			};

			$(document).on('keydown', function(e) {
				var event = window.event ? window.event : e;
				keys[event.keyCode] = true;

				handle();
			});
		};

		setup();

		var player = {
			name: info.name, getNextAction: function() {
				var res = command;
				command = null;
				return res;
			}
		};
		var id = core.setPlayer(player);
		console.log('new player', player.name, 'id', id);
	};


	var player1 = {
		bot: false,
		name: "Artik",
		control: {
			fire: 96,
			up: 38,
			left: 37,
			down: 40,
			right: 39
		}
	};
	var player0 = {
		bot: false,
		name: "Yurii",
		control: {
			fire: 32,
			up: 87,
			left: 65,
			down: 83,
			right: 68
		}
	};

//    addPlayer(player1);
//    addPlayer(player0);
	core.setPlayer(yurii);
	core.setPlayer(artik);
	// core.setPlayer(botRandom);

	var frequency = 100;

	if (frequency >= 100) {
		$('body').addClass('animated');
	} else {
		$('body').removeClass('animated');
	}

	$("#pause").click(function() {
		if ($("#pause").attr("data-pause") === "") {
			core.stopGame();
			$("#pause").attr("data-pause", "paused").text("Play Game");
		}
		else {
			$("#pause").attr("data-pause", "").text("Pause");
			core.startGame(frequency);
		}
	});


	core.startGame(frequency);

	return app;
});

