agit.ns("agit.field");

(function(){
    var sublistField = function($tpl)
    {
        this.extend(this, $tpl);
        this.list = [];
        this.onRemoveCallback = function(){};
    };

    sublistField.prototype = Object.create(agit.field.Field.prototype);

    sublistField.prototype.createRow = function(obj)
    {
        return new agit.field.SublistRow();
    };

    sublistField.prototype.onRemove = function(callback)
    {
        this.onRemoveCallback = callback;
    };

    sublistField.prototype.getCount = function()
    {
        return this.list.length;
    };

    sublistField.prototype.addRow = function($row)
    {
        $row.onRemove(function($row) {
            this.list.splice(this.list.indexOf($row), 1);
            this.list.length || this.addClass("empty");
            this.onRemoveCallback($row.getValue());
        });

        this.append($row).removeClass("empty");
        this.list.push($row);
    };

    sublistField.prototype.setValue = function(value)
    {
        this.list = [];
        this.find("tbody[class!=empty]").remove();

        if (value instanceof Array)
        {
            value.forEach(val => {
                this.addRow(this.createRow(val));
            });
        }

        return this;
    };

    sublistField.prototype.getValue = function()
    {
        var values = [];

        this.list.forEach(function($row){
            values.push($row.getValue());
        });

        return values;
    };

    agit.field.Sublist = sublistField;
})();
