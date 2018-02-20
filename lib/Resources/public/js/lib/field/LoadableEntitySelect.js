ag.ns("ag.admin.field");

(function(){
var LoadableEntitySelect = function(elem, objectName, autofill, nullOption, nameFilter)
{
    var entityType = ag.api.Object.getPropMeta(objectName, "id").type;

    this.hiddenEntities = [];
    this.nullOption = nullOption;
    this.autofill = autofill && !nullOption;

    ag.ui.field.EntitySelect.call(this, elem, null, nameFilter, entityType === "integer");

    ag.srv("preloader").loadEntity(objectName, entities => {
        this.entities = new ag.common.Collection(entities);
        this.refresh();
        this.trigger("ag.field.loaded");
    });
},

getId = function(entity)
{
    return (entity && entity.id !== undefined) ?
        entity.id : entity;
};

LoadableEntitySelect.prototype = Object.create(ag.ui.field.EntitySelect.prototype);


LoadableEntitySelect.prototype.getValue = function()
{
    // the original getValue would return NaN for the nullOption value, which is bad when comparing values
    return ag.ui.field.EntitySelect.prototype.getValue.call(this) || null;
};

LoadableEntitySelect.prototype.setValue = function(value)
{
    if (!value && this.autofill && this.getCount() === 1)
    {
        this.entities.getList().some(entity => {
            if (this.hiddenEntities.indexOf(entity.id) < 0)
                /* jshint boss:true */
                return value = entity;
        });
    }

    return ag.ui.field.EntitySelect.prototype.setValue.call(this, value);
};

LoadableEntitySelect.prototype.refresh = function()
{
    var
        list = this.entities.getList().filter(entity => this.hiddenEntities.indexOf(entity.id) === -1),
        options = this.entitiesToOptions(list);

    options.sort((opt1, opt2) => ag.ui.tool.fmt.out(opt1.text).localeCompare(ag.ui.tool.fmt.out(opt2.text)));

    this.empty();

    if (this.nullOption) {
        this.hasIntro = false;
        options.unshift({ value: "", text: this.nullOption });
    }
    else {
        this.addIntro();
    }

    ag.ui.field.Select.prototype.setOptions.call(this, options);

    if (!this.currentValue || !this.containsOption(this.currentValue))
    {
        this.currentValue = null;
    }

    this.setValue(this.currentValue);
};

// add an entity which is part of a parent entity and might not be in the
// retrieved entity list (e.g. because it's "deleted")
LoadableEntitySelect.prototype.addEntity = function(entity)
{
    this.entities.add(entity);
    this.refresh();
};

// hide an entity, e.g. because it was inserted in a different view element
LoadableEntitySelect.prototype.hideEntity = function(entity)
{
    this.hiddenEntities.indexOf(getId(entity)) === -1 && this.hiddenEntities.push(getId(entity));
    this.refresh();
};

// unhide a previously hidden entity
LoadableEntitySelect.prototype.unhideEntity = function(entity)
{
    this.hiddenEntities.splice(this.hiddenEntities.indexOf(getId(entity)), 1);
    this.refresh();
};

// hide a fixed set of entities (and only that set)
LoadableEntitySelect.prototype.hideEntities = function(entities)
{
    this.hiddenEntities = entities.map(entity => getId(entity));
    this.refresh();
};

// hide all available entities
LoadableEntitySelect.prototype.hideAllEntities = function()
{
    this.hiddenEntities = this.entities.getList().map(entity => getId(entity));
    this.refresh();
};

// unhide all previously hidden entities
LoadableEntitySelect.prototype.unhideAllEntities = function()
{
    this.hiddenEntities = [];
    this.refresh();
};

// returns the number of selectable items
LoadableEntitySelect.prototype.getCount = function()
{
    return this.entities.length - this.hiddenEntities.length;
};

LoadableEntitySelect.prototype.getEntities = function(includeDeleted)
{
    return this.entities.getList().filter(entity => includeDeleted || this.hiddenEntities.indexOf(getId(entity)) < 0);
};

ag.admin.field.LoadableEntitySelect = LoadableEntitySelect;

})();
