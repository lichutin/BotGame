define(['jquery'], function ($) {
    'use strict';

	var defaultBias = Math.floor(Math.random()*200),
		colorBias = 100+Math.floor(Math.random()*50);

    var color = function(id) {
		return 'hsl(' + (defaultBias + id * colorBias) + ',60%,60%)'
	};

    var drawHealth = function(player){
		var i = $('.health[data-player=' + player.id + '] .value');
		if (i.length){
			i.css('width', player.health+'%');
		} else {
			var health = $("<div />").addClass("health").attr("data-player", player.id)
				.css({'border-color': color(player.id)});
			var indicator = $("<div />").addClass("value")
				.css({'width': '100%', 'background-color': color(player.id)}).text(player.name);
			health.append(indicator);
			$(".health-status").append(health);
		}
	};

    var drawScore = function (player)
    {
        var score = $('.score[data-player=' + player.id + ']  label');
        if (score.length)
        {
            score.text(player.score);
        }
        else
        {
            score = $("<div />").addClass("score").attr("data-player", player.id).text(player.name + ": ");
            var label = $("<label />").text(player.score);
            score.append(label);
            $(".score-table").append(score);
        }
    };
    var drawPlayer = function (player)
    {
        var obj = $('[data-id=' + player.id + ']');
        if (obj.length)
        {
            moveObject(player.id, player.position);
        }
        else {
            var newObj = $("<div />").addClass("gamer").text(player.name)
                    .css({
                        "background-color": color(player.id),
                        width: player.size.width + 'px',
                        height: player.size.height+ 'px'
                    });
            createObject(player.id, newObj, player.position);
        }
    };
    var drawBullet = function (bullet)
    {
        var obj = $('[data-id=' + bullet.id + ']');
        if (obj.length)
        {
            moveObject(bullet.id, bullet.position);
        }
        else
        {
            var newObj = $("<div />").addClass("bullet").attr('data-player', bullet.pid)
                    .css({
                        'background-color': color(bullet.pid),
                        width: bullet.size.width+ 'px',
                        height: bullet.size.height+ 'px'
                    });
            createObject(bullet.id, newObj, bullet.position);
        }
    };
    var remove = function (object)
    {
        removeObject(object.id);
    }

    var createObject = function (id, object, position)
    {
        object.attr('data-id', id).css({top: position.yCur, left: position.xCur}).appendTo($('.battlefield'));
    };
    var moveObject = function (id, position)
    {
        $('[data-id=' + id + ']').css({top: position.yCur, left: position.xCur})
    };
    var removeObject = function (id)
    {
        $('[data-id=' + id + ']').remove();
    };
    var drawWin=function(winner) {
    	var winText = $('<div/>').addClass('win').text('Winner — '+winner.name).css('background-color',color(winner.id));
		$('.battlefield').empty().append(winText)
	};
    return{
        player: drawPlayer,
        bullet: drawBullet,
        score: drawScore,
        health: drawHealth,
		win:drawWin,
        remove: remove
    };
});

