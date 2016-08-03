ag.ns("ag.admin.field");

(function(){
    var
        validInt = function(value, max)
        {
            return ag.common.isValid("integer", value, 0, max);
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
            return ag.ui.tool.fmt.sprintf(
                "%s:%s",
                Math.floor(number / 60),
                ag.ui.tool.fmt.numpad(number % 60, 2)
            );
        },

        timeField = function($field)
        {
            this.extend(this, $field || $("<input type='text' class='form-control'>"));

            this.on("blur", ev => {
                this.setValue(timeToNumber(this.origVal()));
            });
        };

    timeField.prototype = Object.create(ag.ui.field.Field.prototype);

    timeField.prototype.setValue = function(value)
    {
        if (value instanceof Object)
        {
            value = validateHourMinute(value.hour, value.minute)
                ? value.hour * 60 + value.minute
                : null
        }

        return this.origVal(validInt(value) ? numberToTime(value) : "");
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
