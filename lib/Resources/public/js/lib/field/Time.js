ag.ns("ag.admin.field");

(function(){

var
    timeField = function()
    {
        ag.ui.field.Text.apply(this, arguments);
        this.addClass("time").on("blur", () => this.setValue(timeToNumber(this.origVal())));
    },

    validInt = function(value, max)
    {
        return ag.vld.isValid("integer", value, 0, max);
    },

    validateHourMinute = function(hour, minute)
    {
        return (validInt(hour, 23) && validInt(minute, 59));
    },

    timeToNumber = function(timeString)
    {
        var
            result = null,
            timeParts = timeString ? timeString.replace(/[^0-9\.\:]/g, "").replace(".", ":").split(":") : [];

        // fix simplified input, e.g. 930 instead of 9:30
        if (timeParts.length === 1 && timeParts[0].length && !timeParts[0].match(/[^0-9]/))
        {
            timeString = parseInt(timeString);
            timeParts[0] = (timeString - timeString % 100) / 100;
            timeParts[1] = timeString - timeParts[0] * 100;
        }

        timeParts = timeParts.map(part => parseInt(part));

        if (validateHourMinute(timeParts[0], timeParts[1]))
            result = timeParts[0] * 60 + timeParts[1];

        return result;
    },

    numberToTime = function(number)
    {
        return ag.u.sprintf(
            "%s:%s",
            Math.floor(number / 60),
            ag.u.numpad(number % 60, 2)
        );
    };


timeField.prototype = Object.create(ag.ui.field.Text.prototype);

timeField.prototype.setValue = function(value)
{
    if (value instanceof Object)
        value = validateHourMinute(value.hour, value.minute) ?
            value.hour * 60 + value.minute :
            null;

    this.origVal(validInt(value) ? numberToTime(value) : "");

    this.triggerHandler("ag.field.set");
    return this;
};

timeField.prototype.getValue = function()
{
    var time = timeToNumber(this.origVal());
    return validInt(time) ? { hour : Math.floor(time / 60), minute : time % 60 } : null;
};

timeField.prototype.toNumber = function()
{
    var time = timeToNumber(this.origVal());
    return validInt(time) ? time : null;
};

timeField.prototype.toString = function()
{
    var time = timeToNumber(this.origVal());
    return validInt(time) ? numberToTime(time) : "";
};

ag.admin.field.Time = timeField;

})();
