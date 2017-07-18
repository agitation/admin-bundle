ag.ns("ag.admin");

(function(){

var entityForm = function(entityName, rows)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editview-form"));

        this.entityName = entityName;
        this.rows = rows;
        this.changed = false;
        this.savedState = {}; // saved state of rows; used to check for modifications

        var tfoot = this.find("tfoot");

        Object.keys(rows).forEach(key => {
            tfoot.before(rows[key]);
            this.savedState[key] = rows[key].getField().getValue();
        });

        this.on("reset", ev => {
            ev.preventDefault();
            this.setValues(this.savedState);
        });

        this.on("submit", ev => {
            ev.preventDefault();

            var object = new ag.api.Object(this.entityName, this.getValues()),
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
                        this.setValues(result);
                        object.id || ag.srv("state").update("/edit", result.id);
                        this.trigger("ag.admin.entity." + mode, result);
                    }
                }
            );
        });
    };

entityForm.prototype = Object.create(ag.ui.ctxt.Block.prototype);

entityForm.prototype.getValues = function()
{
    var values = {};

    Object.keys(this.rows).forEach(key => {
        values[key] = this.rows[key].getField().getValue();
    });

    return values;
};

entityForm.prototype.setValues = function(entity)
{
    entity && Object.keys(this.rows).forEach(key => {
        entity[key] !== undefined && this.rows[key].getField().setValue(entity[key]);
        this.savedState[key] !== undefined && (this.savedState[key] = this.rows[key].getField().getValue()); // we use getValue() because of possible transformations
    });
};

entityForm.prototype.isChanged = function()
{
    return !ag.tool.valuesAreEqual(this.savedState, this.getValues());
};

entityForm.prototype.getAction = function()
{
    return (request) => {
        if (request === "new")
            this.setValues(new ag.api.Object(this.entityName));

        else if (request && (typeof(request) === "string" || typeof(request) === "number"))
            ag.srv("api").doCall(this.entityName + ".get", request, this.setValues.bind(this));
    };
};

ag.admin.EntityEditForm = entityForm;

})();
