ag.ns("ag.admin.field");

(function(){
    var
        echoField = function()
        {
            this.extend(this, $("<span>"));
            this.value = undefined;
        };

    echoField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    echoField.prototype.setValue = function(value)
    {
        this.text(ag.ui.tool.fmt.out(value));
        this.value = value;
        this.triggerHandler("ag.field.set");
        return this;
    };

    echoField.prototype.getValue = function()
    {
        return this.value;
    };

    ag.admin.field.Echo = echoField;
})();
