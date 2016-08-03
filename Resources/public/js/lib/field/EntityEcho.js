ag.ns("ag.admin.field");

(function(){
    var
        entityEchoField = function()
        {
            this.value = null;
        };

    entityEchoField.prototype = Object.create(ag.admin.field.Echo.prototype);

    entityEchoField.prototype.setValue = function(value)
    {
        if (value instanceof Object && value.id)
            this.value = value.id;
        else if (ag.common.isValid("integer", value, 1))
            this.value = value;
        else
            value = null;

        return this;
    };

    ag.admin.field.EntityEcho = entityEchoField;
})();
