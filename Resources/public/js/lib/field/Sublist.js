ag.ns("ag.admin.field");

(function(){
    var
        createAndAddRow = function(obj)
        {
            var row = this.createRow();
            row.setValue(obj);
            this.addRow(row);
        },

        sublistField = function($tpl)
        {
            this.extend(this, $tpl);
            this.list = [];

            // check if row factory method is present
            if (typeof(this.createRow) !== "function")
                throw new Error("The createRow method must be implemented!");

            this.on("ag.admin.sublist.add", (ev, obj) => {
                createAndAddRow.call(this, obj);
            });
        };

    sublistField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    sublistField.prototype.getCount = function()
    {
        return this.list.length;
    };

    sublistField.prototype.addRow = function($row)
    {
        $row.on("ag.admin.sublist.remove", (ev, obj) => {
            this.list.splice(this.list.indexOf($row), 1);
            this.list.length || this.addClass("empty");
        });

        this.removeClass("empty").append($row);
        this.list.push($row);
    };

    sublistField.prototype.setValue = function(value)
    {
        this.list = [];
        this.find("tbody[class!=empty]").remove();

        if (value instanceof Array)
            value.forEach(obj => createAndAddRow.call(this, obj));

        return this;
    };

    sublistField.prototype.getValue = function()
    {
        var values = [];

        this.list.forEach($row => {
            values.push($row.getValue());
        });

        return values;
    };

    ag.admin.field.Sublist = sublistField;
})();
