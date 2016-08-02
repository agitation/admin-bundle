ag.ns("ag.admin.field");

{
    var
        echoField = function()
        {
            this.value = undefined;
        };

    echoField.prototype = Object.create(ag.ui.field.Field.prototype);

    echoField.prototype.setValue = function(value)
    {
        this.value = value;
        return this;
    };

    echoField.prototype.getValue = function()
    {
        return this.value;
    };

    ag.admin.field.Echo = echoField;
};
