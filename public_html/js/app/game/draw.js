define(['jquery'], function ($) {
    'use strict';
    var colors = ["#f00", "#0f0", "#00f", "#fa0"];

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
        //todo: сделать как у пули

        var obj = $('[data-id=' + player.id + ']');
        if (obj.length)
        {
            moveObject(player.id, player.position);
        }
        else {
            var newObj = $("<div />").addClass("gamer").text(player.name)
                    .css({
                        "background": colors[player.id],
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
                        'background': colors[bullet.pid],
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
    return{
        player: drawPlayer,
        bullet: drawBullet,
        score: drawScore,
        remove: remove
    };
});

