ag.ns("ag.admin.field");

(function(){
    var sublistRowField = function($tpl)
    {
        this.extend(this, $tpl || $("<tbody>"));

        this.find(".remove button").click(ev => {
            this.trigger("ag.admin.sublist.remove", this.getValue());
            this.remove();
        });
    };

    sublistRowField.prototype = Object.create(ag.ui.field.Field.prototype);

    sublistRowField.prototype.setValue = function(value)
    {
        this.setValues(value);
        return this;
    };

    sublistRowField.prototype.getValue = function()
    {
        return this.getValues();
    };

    ag.admin.field.SublistRow = sublistRowField;
})();
