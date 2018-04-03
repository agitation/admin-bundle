ag.ns("ag.admin");

(function(){

var FormRow = function(label, field)
{
    this.label = label;
    this.field = field;
};

FormRow.prototype = Object.create(jQuery.prototype);

FormRow.prototype.getField = function()
{
    return this.field;
};

ag.admin.FormRow = FormRow;

})();
