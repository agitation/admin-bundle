ag.ns("ag.admin");

(function(){

var EntityEditForm = function(entityName, rows)
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

    this.on("reset", this.onReset.bind(this));
    this.on("submit", this.onSubmit.bind(this));
};

EntityEditForm.prototype = Object.create(ag.ui.ctxt.Block.prototype);

EntityEditForm.prototype.onReset = function(ev)
{
    ev.preventDefault();
    this.setValues(this.savedState);
};

EntityEditForm.prototype.onSubmit = function(ev)
{
    ev.preventDefault();

    var object = new ag.api.Object(this.entityName, this.getValues()),
        mode = (object.id ? "update" : "create");

    ag.srv("api").doCall(
        this.entityName + "." + mode,
        object,
        this.apiCallback.bind(this, mode)
    );
};

EntityEditForm.prototype.apiCallback = function(mode, result, status)
{
    var isUpdate = mode === "update";

    if (status === 200)
    {
        var successMsg = isUpdate ?
            ag.intl.t("The object was updated successfully.") : ag.intl.t("The object was created successfully.");

        ag.srv("messageHandler").alert(successMsg, "success");
        this.setValues(result);
        isUpdate || ag.srv("state").update("/edit", result.id);
        this.trigger("ag.admin.entity." + mode, result);
    }
};


EntityEditForm.prototype.getValues = function()
{
    var values = {};

    Object.keys(this.rows).forEach(key => {
        values[key] = this.rows[key].getField().getValue();
    });

    return values;
};

EntityEditForm.prototype.setValues = function(entity)
{
    entity && Object.keys(this.rows).forEach(key => {
        entity[key] !== undefined && this.rows[key].getField().setValue(entity[key]);
        this.savedState[key] !== undefined && (this.savedState[key] = this.rows[key].getField().getValue()); // we use getValue() because of possible transformations
    });
};

EntityEditForm.prototype.isChanged = function()
{
    return !ag.tool.valuesAreEqual(this.savedState, this.getValues());
};

EntityEditForm.prototype.getAction = function()
{
    return (request) => {
        if (request === "new")
            this.setValues(new ag.api.Object(this.entityName));

        else if (request && (typeof(request) === "string" || typeof(request) === "number"))
            ag.srv("api").doCall(this.entityName + ".get", request, this.setValues.bind(this));
    };
};

ag.admin.EntityEditForm = EntityEditForm;

})();
