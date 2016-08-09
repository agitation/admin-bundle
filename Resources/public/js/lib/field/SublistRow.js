ag.ns("ag.admin.field");

(function(){
    var sublistRowField = function($tpl)
    {
        this.extend(this, $tpl || $("<tbody>"));

        this.find(".remove button").click(ev => {
            this.trigger("ag.admin.sublist.remove", this.getValue());
            this.remove();
        });

        this.fields = {};
    };

    sublistRowField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    sublistRowField.prototype.setValue = function(value)
    {
        Object.keys(this.fields).forEach(name => this.fields[name].setValue(value[name]));
        return this;
    };

    sublistRowField.prototype.getValue = function()
    {
        var value = {};

        Object.keys(this.fields).forEach(name => {
            value[name] = this.fields[name].getValue();
        });

        return value;
    };

    ag.admin.field.SublistRow = sublistRowField;
})();
