define(['game/core'], function (core) {
    var shot = false;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var getRandomNumber = function ()
    {
        return getRandomInt(1, 5);
    };

    var player = {
        getNextAction: function (info) {
            console.log(info)
            if (shot)
            {
                shot = false;
                return core.actionTypes.fire;
            }
            else {
                shot = true;

                switch (getRandomNumber())
                {
                    case 1:
                        return core.actionTypes.moveUp;
                        break;

                    case 2:
                        return core.actionTypes.moveDown;
                        break;

                    case 3:
                        return core.actionTypes.moveLeft;
                        break;

                    case 4:
                        return core.actionTypes.moveRight;
                        break;
                }
            }
        },
        name: 'Artik'
    };

    return player;
});

