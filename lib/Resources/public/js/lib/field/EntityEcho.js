ag.ns("ag.admin.field");

(function(){
    var
        entityEchoField = function()
        {
            this.extend(this, $("<span>"));
            this.value = null;
        };

    entityEchoField.prototype = Object.create(ag.admin.field.Echo.prototype);

    entityEchoField.prototype.setValue = function(value)
    {
        var name = "";

        if (value instanceof Object && value.id)
        {
            this.value = value.id;
            name = value.name ? ag.ui.tool.fmt.out(value.name) : value.id;
        }
        else if (ag.vld.isValid("integer", value, 1))
        {
            if (value !== this.value)
            {
                name = value;
                this.value = value;
            }
        }
        else
        {
            name = "–";
            value = null;
        }

        this.text(name);

        return this.triggerHandler("ag.field.set");
    };

    ag.admin.field.EntityEcho = entityEchoField;
})();
