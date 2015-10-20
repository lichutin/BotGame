define([], function () {
    var players = [];

    var core = {
        setPlayer: function (player) {
            players.push(player);
            return players.indexOf(player);
        }
    };

    return core;
});