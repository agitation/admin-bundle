ag.ns("ag.admin");

(function(){

var EntityEditForm = function(entityName, rows)
{
    this.extend(this, ag.u.tpl("agitadmin-editview", ".editview-form"));

    var tfoot = this.find("tfoot");

    this.entityName = entityName;
    this.rows = rows;
    this.changed = false;
    this.savedState = {}; // saved state of rows; used to check for modifications

    Object.keys(rows).forEach(key => {
        tfoot.before(rows[key]);
        this.savedState[key] = rows[key].getField().getValue();
    });

    this.on("reset", this.onReset.bind(this));
    this.on("submit", this.onSubmit.bind(this));

    this.registerController((request) => {
        if (request === "new")
            this.setValues(new ag.api.Object(this.entityName));

        else if (request && (typeof(request) === "string" || typeof(request) === "number"))
            ag.s.api.doCall(this.entityName + ".get", request, this.setValues.bind(this));
    });
};

EntityEditForm.prototype = Object.create(ag.ui.ctxt.Block.prototype);

EntityEditForm.prototype.onReset = function(ev)
{
    ev.preventDefault();

    if (!this.savedState.id) // before first saving
        this.setValues(this.savedState);
    else
        ag.s.api.doCall(
            this.entityName + ".get",
            this.savedState.id,
            this.setValues.bind(this)
        );
};

EntityEditForm.prototype.onSubmit = function(ev)
{
    ev.preventDefault();

    var object = new ag.api.Object(this.entityName, this.getValues()),
        mode = (object.id ? "update" : "create");

    ag.s.api.doCall(
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

        ag.s.msg.alert(successMsg, "success");
        this.setValues(result);
        isUpdate || ag.s.state.update("/edit", result.id);
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

ag.admin.EntityEditForm = EntityEditForm;

})();
