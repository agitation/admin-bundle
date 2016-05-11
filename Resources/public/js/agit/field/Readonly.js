agit.ns("agit.field");

(function(){
    var
        readonlyField = function(filter, returnRealValue)
        {
            this.extend(this, agit.tool.tpl("agitadmin-forms", ".readonly"));
            this.valueFilter = filter;
            this.returnRealValue = returnRealValue;
            this.currentValue = null;
        };

    readonlyField.prototype = Object.create(agit.field.Field.prototype);

    readonlyField.prototype.setValue = function(value)
    {
        if (value === null)
        {
            this.html(agit.tool.tpl("agitadmin-forms", ".readonly .empty"));
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

    agit.field.Readonly = readonlyField;
})();
