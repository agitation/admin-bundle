ag.ns("ag.admin");

(function(){
var
    entityEditFormRow = function(label, field, description, optional)
    {
        this.nodify();

        this.field = field;

        this.find("th label").text(label);
        this.find("td .field").html(field);

        description && this.find("td .description").html(description);
        optional || this.find("th .optional").remove();
    };

entityEditFormRow.prototype = Object.create(ag.ui.field.ComplexField.prototype);

entityEditFormRow.prototype.nodify = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editview-form-row"));
};

entityEditFormRow.prototype.setValue = function(value)
{
    this.field.setValue(value);
    return this.triggerHandler("ag.field.set");
};

entityEditFormRow.prototype.getValue = function()
{
    return this.field.getValue();
};

ag.admin.EntityEditFormRow = entityEditFormRow;

})();
