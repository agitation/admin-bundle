ag.ns("ag.admin.field");

(function(){
    var oneToManyRow = function()
    {
        this.nodify();
        this.fields = {};

        this.find(".remove button").click(() => this.trigger("ag.admin.onetomany.remove", this.getValue()).remove());
    };

    oneToManyRow.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    oneToManyRow.prototype.setValue = function(value)
    {
        Object.keys(this.fields).forEach(name => this.fields[name].setValue(value[name]));
        return this;
    };

    oneToManyRow.prototype.getValue = function()
    {
        var value = {};

        Object.keys(this.fields).forEach(name => {
            value[name] = this.fields[name].getValue();
        });

        return value;
    };

    ag.admin.field.OneToManyRow = oneToManyRow;
})();
