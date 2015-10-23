define([], function () {
    var baseObject = function () {

    };

    var createObject = function ()
    {
        var obj = new baseObject();
        obj.position = {xCur: 0, yCur: 0, xNext: 0, yNext: 0};
        obj.size = {width: 0, height: 0};
        obj.id = 0;

        return obj;
    };

    baseObject.prototype.hitTest = function (anotherObject) {
        var deltaX = anotherObject.position.xCur - this.position.xCur;
        var deltaY = anotherObject.position.yCur - this.position.yCur;

        if ((deltaX > -anotherObject.size.width && deltaX < this.size.width) && (deltaY > -anotherObject.size.height && deltaY < this.size.height))
            return true;

        return false;
    };

    return {createObject: createObject};
});

