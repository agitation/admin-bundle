ag.ns("ag.admin.field");

(function(){
    var
        timeToNumber = function(timeString)
        {
            var
                result = 0,
                timeParts = timeString.replace(".", ":").split(":");

            if (timeParts.length === 1 && timeParts[0].length && !timeParts[0].match(/[^0-9]/))
            {
                timeString = parseInt(timeString);
                timeParts[0] = (timeString - timeString % 100) / 100;
                timeParts[1] = timeString - timeParts[0] * 100;
            }

            timeParts = timeParts.map(function(v){ return parseInt(v); });

            if (timeParts[0] >= 0 && timeParts[0] <= 23 && timeParts[1] >= 0 && timeParts[1] <= 59)
            {
                result = timeParts[0] * 60 + timeParts[1];
            }

            return result;
        },

        numberToTime = function(number)
        {
            return ag.ui.tool.fmt.sprintf("%s:%s", Math.floor(number / 60), ag.ui.tool.fmt.numpad(number % 60, 2));
        },

        timeField = function($field, returnAsMinutes)
        {
            $field = $field || $("<input type='text' class='form-control'>");
            this.extend(this, $field);

            this.on("blur", function() {
                this.setValue(numberToTime(timeToNumber(this.getValue())));
            });

            this.returnAsMinutes = returnAsMinutes;
        };

    timeField.prototype = Object.create(ag.ui.field.Field.prototype);

    timeField.prototype.setValue = function(value)
    {
        if (value instanceof Object)
            value = value.hour * 60 + value.minute;

        return this.origVal(value || value === 0 ? numberToTime(value) : "");
    };

    timeField.prototype.getValue = function()
    {
        var time = timeToNumber(this.origVal());
        return this.returnAsMinutes ? time : { hour : Math.floor(time / 60), minute : time % 60 };
    };

    ag.ui.field.Time = timeField;
})();
