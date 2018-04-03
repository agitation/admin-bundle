ag.ns("ag.admin");

(function(){

var EditFormRow = function(label, field, description, optional)
{
    ag.admin.FormRow.call(this, label, field);

    this.extend(this, ag.u.tpl("agitadmin-forms", ".edit-form-row"));
    this.find("th label").text(label);
    this.find("td .field").html(field);

    description && this.find("td .description").html(description);
    optional || this.find("th .optional").remove();
};

EditFormRow.prototype = Object.create(ag.admin.FormRow.prototype);

ag.admin.EditFormRow = EditFormRow;

})();
