ag.ns("ag.admin");

(function(){
var
    fillForm = function(entity)
    {
        this.entity = entity;

        entity && Object.keys(this.rows).forEach(key => {
            entity[key] !== undefined && this.rows[key].getField().setValue(entity[key]);
        });
    },

    entityForm = function(entityName, rows)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editview-form"));

        this.rows = rows;
        this.entityName = entityName;
        this.entity = {}; // currently saved state of the entity.

        var tfoot = this.find("tfoot");
        Object.keys(rows).forEach(key => tfoot.before(rows[key]));

        this.on("reset", ev => {
            ev.preventDefault();
            fillForm.call(this, this.entity);
        });

        this.on("submit", ev => {
            var object = new ag.api.Object(this.entityName), mode;

            ev.preventDefault();

            Object.keys(rows).forEach(key => {
                object[key] = rows[key].getField().getValue();
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

                        this.trigger("ag.admin.entity." + mode, result);
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
