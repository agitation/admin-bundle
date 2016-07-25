ag.ns("ag.admin.field");

(function(){
    var sublistRowField = function($tpl)
    {
        this.extend(this, $tpl || $("<tbody>"));
        this.onRemoveCallback = function(){};

        this.find(".remove button").click(() => {
            this.onRemoveCallback(this);
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

    sublistRowField.prototype.onRemove = function(callback)
    {
        this.onRemoveCallback = callback;
    };

    ag.admin.field.SublistRow = sublistRowField;
})();
