ag.ns("ag.admin");

(function(){
var
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
            this.fillForm(this.entity);
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

                        this.fillForm(result);

                        object.id || ag.srv("state").update("/edit", result.id);

                        this.trigger("ag.admin.entity." + mode, result);
                    }
                }
            );
        });
    };

entityForm.prototype = Object.create(ag.ui.ctxt.Block.prototype);

entityForm.prototype.fillForm = function(entity)
{
    this.entity = entity;

    entity && Object.keys(this.rows).forEach(key => {
        entity[key] !== undefined && this.rows[key].getField().setValue(entity[key]);
    });
};

entityForm.prototype.getAction = function()
{
    return (request) => {
        if (request === "new")
            this.fillForm(new ag.api.Object(this.entityName));

        else if (request && (typeof(request) === "string" || typeof(request) === "number"))
            ag.srv("api").doCall(this.entityName + ".get", request, this.fillForm.bind(this));
    };
};

ag.admin.EntityEditForm = entityForm;

})();
