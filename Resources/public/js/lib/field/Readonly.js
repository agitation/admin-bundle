ag.ns("ag.admin.field");

(function(){
    var
        readonlyField = function(filter, returnRealValue, nullPlaceholder)
        {
            this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".readonly"));
            this.valueFilter = filter;
            this.nullPlaceholder = nullPlaceholder || ag.ui.tool.tpl("agitadmin-forms", ".readonly .empty");
            this.returnRealValue = returnRealValue;
            this.currentValue = null;
        };

    readonlyField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    readonlyField.prototype.setValue = function(value)
    {
        if (value === null)
        {
            this.html(this.nullPlaceholder);
        }
        else
        {
            if (this.valueFilter)
                this.html(this.valueFilter(value));
            else
                this.text(value);
        }

        this.currentValue = value;

        return this;
    };

    readonlyField.prototype.getValue = function()
    {
            return this.returnRealValue ? this.currentValue : null;
    };

    ag.admin.field.Readonly = readonlyField;
})();
