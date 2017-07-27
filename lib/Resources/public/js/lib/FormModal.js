ag.ns("ag.admin");

(function(){
var formModal = function(fields, submitCallback)
    {
        ag.ui.modal.Dialog.call(this);
        this.addClass("form-modal");

        var table = ag.ui.tool.tpl("agitadmin-forms", ".form-modal").empty(),
            callbackWrapper = onSubmit.bind(this);

        this.form = $("<form>").append(table);
        this.fields = fields;
        this.callback = submitCallback;

        Object.keys(fields).forEach(name => {
            var row = ag.ui.tool.tpl("agitadmin-forms", ".form-modal tr");
            row.find("th").text(fields[name].label);
            row.find("td").html(fields[name].element);
            table.append(row);
        });

        this.find(".main").replaceWith(this.form);

        this.find(".footer").html(this.createButton("ok", callbackWrapper));
        this.form.submit(callbackWrapper);
    },

    onSubmit = function()
    {
        var data = {};

        Object.keys(this.fields).forEach(name => {
            data[name] = this.fields[name].element.getValue();
        });

        this.callback(data);
    };

formModal.prototype = Object.create(ag.ui.modal.Dialog.prototype);

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

    ag.ui.modal.Dialog.prototype.destroy.call(this);
};

ag.admin.FormModal = formModal;

})();
