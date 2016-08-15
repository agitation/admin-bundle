ag.ns("ag.admin.field");

(function(){
    var oneToManyRow = function($tpl)
    {
        this.nodify();

        this.find(".remove button").click(ev => {
            this.trigger("ag.admin.onetomany.remove", this.getValue());
            this.remove();
        });

        this.fields = {};
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
