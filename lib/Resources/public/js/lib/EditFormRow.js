ag.ns("ag.admin");

(function(){
var
    editFormRow = function(label, field, description, optional)
    {
        this.nodify();
        this.field = field;
        this.find("th label").text(label);
        this.find("td .field").html(field);

        description && this.find("td .description").html(description);
        optional || this.find("th .optional").remove();
    };

editFormRow.prototype = Object.create(ag.ui.elem.FormRow.prototype);

editFormRow.prototype.nodify = function()
{
    this.extend(this, ag.u.tpl("agitadmin-forms", ".form-row"));
};

ag.admin.EditFormRow = editFormRow;

})();
