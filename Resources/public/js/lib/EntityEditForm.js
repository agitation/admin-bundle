ag.ns("ag.admin");

(function(){
var
    fillForm = function(entity)
    {
        this.entity = entity;

        entity && Object.keys(this.fields).forEach(key => {
            entity[key] !== undefined &&
                this.fields[key].element.setValue(entity[key]) &&
                this.fields[key].element.change(); // is that a good idea? circular deps? side effects?
        });

        this.trigger("agit.entityform.update");
    },

    entityForm = function(entityName, fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editview-form"));

        var
            $tbody = this.find("tbody").empty();

            this.entityName = entityName;
            this.fields = fields;
            this.entity = {}; // currently saved state of the entity. NOT TO BE MODIFIED!

        Object.keys(fields).forEach(key => {
            var
                field = fields[key],
                $row = ag.ui.tool.tpl("agitadmin-editview", ".editview-form tbody tr");

            $row.find("th label").text(field.label);
            $row.find("td").html(field.element);

            field.optional || $row.find("th .optional").remove();
            $tbody.append($row);
        });

        this.on("reset", ev => {
            this.stopEvent(ev);
            fillForm.call(this, this.entity);
        });

        this.on("submit", ev => {
            var values = {};

            this.stopEvent(ev);

            Object.keys(fields).forEach(key => {
                values[key] = fields[key].element.getValue();
            });

            ag.srv("api").doCall(
                entityName + "." + (values.id ? "update" : "create"),
                values,
                (result, status) => {
                    if (status === 200)
                    {
                        var successMsg = values.id
                            ? ag.intl.t("The object was updated successfully.")
                            : ag.intl.t("The object was created successfully.");

                        ag.srv("messageHandler").alert(successMsg, "success");

                        fillForm.call(this, result);

                        values.id || ag.srv("state").update("/edit", result.id);
                    }
                }
            );
        });
    };

entityForm.prototype = Object.create(ag.ui.ctxt.Form.prototype);

entityForm.prototype.getAction = function()
{
    return (request) => {
        if (request === "new")
            fillForm.call(this, new ag.api.Object(this.entityName));

        else if (request && !isNaN(request))
            ag.srv("api").doCall(this.entityName + ".get", request, fillForm.bind(this));
    }
};

ag.admin.EntityEditForm = entityForm;

})();
