ag.ns("ag.admin.field");

(function(){
    var sublistField = function($tpl)
    {
        this.extend(this, $tpl);
        this.list = [];

        // check if row factory method is present
        if (typeof(this.createRow) !== "function")
            throw new Error("The createRow method must be implemented!");

        this.on("ag.admin.sublist.add", (ev, obj) => {
            this.addRow(this.createRow(obj));
        });
    };

    sublistField.prototype = Object.create(ag.ui.field.Field.prototype);

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

        this.list.forEach($row => {
            values.push($row.getValue());
        });

        return values;
    };

    ag.admin.field.Sublist = sublistField;
})();
