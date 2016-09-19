ag.ns("ag.admin");

(function(){
var
    fillForm = function(entity)
    {
        this.entity = entity;

        entity && Object.keys(this.fields).forEach(key => {
            entity[key] !== undefined && this.fields[key].element.setValue(entity[key]);
        });
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
            ev.preventDefault();
            fillForm.call(this, this.entity);
        });

        this.on("submit", ev => {
            var object = new ag.api.Object(this.entityName), mode;

            ev.preventDefault();

            Object.keys(fields).forEach(key => {
                object[key] = fields[key].element.getValue();
            });

            mode = (object.id ? "update" : "create");

            ag.srv("api").doCall(
                entityName + "." + mode,
                object,
                (result, status) => {
                    if (status === 200)
                    {
                        var successMsg = object.id ?
                            ag.intl.t("The object was updated successfully.") : ag.intl.t("The object was created successfully.");

                        ag.srv("messageHandler").alert(successMsg, "success");

                        fillForm.call(this, result);

                        object.id || ag.srv("state").update("/edit", result.id);

                        this.trigger("ag.admin.entity." + mode, object);
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

        else if (request && (typeof(request) === "string" || typeof(request) === "number"))
            ag.srv("api").doCall(this.entityName + ".get", request, fillForm.bind(this));
    };
};

ag.admin.EntityEditForm = entityForm;

})();
