ag.ns("ag.admin");

(function(){
var
    formModal = function(fields, successCallback)
    {
        ag.ui.elem.ConfirmModal.call(this, "", successCallback);

        this.fields = fields;

        this.addClass("form-modal");

        var table = ag.ui.tool.tpl("agitadmin-forms", ".form-modal").empty();

        this.elements.main.replaceWith(table);
        this.elements.main = table;

        Object.keys(fields).forEach(name => {
            var row = ag.ui.tool.tpl("agitadmin-forms", ".form-modal tr");

            row.find("th").text(fields[name].label);
            row.find("td").html(fields[name].element);

            this.elements.main.append(row);
        });
    };

formModal.prototype = Object.create(ag.ui.elem.ConfirmModal.prototype);

formModal.prototype.setValues = function(values)
{
    Object.keys(this.fields).forEach(key => {
        this.fields[key].element.setValue(values[key]);
    });

    return this;
};

formModal.prototype.getValues = function()
{
    var values = {};

    Object.keys(this.fields).forEach(key => {
        values[key] = this.fields[key].element.getValue();
    });

    return values;
};

formModal.prototype.destroy = function()
{
    // we must detach the fields, because otherwise they'd become zombies and loose their event handlers
    Object.keys(this.fields).forEach(name => this.fields[name].element.detach());

    ag.ui.elem.ConfirmModal.prototype.destroy.call(this);
};


ag.admin.FormModal = formModal;
})();
