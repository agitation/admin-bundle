ag.ns("ag.admin.field");

(function(){
    var
        getId = function(entity)
        {
            return (entity && entity.id !== undefined) ?
                entity.id : entity;
        },

        entitySelectField = function(elem, objectName, nullOption)
        {
            var dummyEntity = new ag.api.Object(objectName);

            ag.ui.field.EntitySelect.call(this, elem);

            this.hiddenEntities = [];
            this.nullOption = nullOption;

            if (dummyEntity.getPropMeta("id").type === "number")
                this.attr("data-type", "int");

            ag.srv("preloader").loadEntity(objectName, entities => {
                this.entities = new ag.common.Collection(entities);
                this.refresh();
            });
        };

    entitySelectField.prototype = Object.create(ag.ui.field.EntitySelect.prototype);

    entitySelectField.prototype.refresh = function()
    {
        var
            list = this.entities.sort().filter(entity => this.hiddenEntities.indexOf(entity.id) === -1),
            options = this.entitiesToOptions(list);

        this.empty();

        if (this.nullOption) {
            this.hasIntro = false;
            options.unshift({ value: "", text: this.nullOption });
        }
        else {
            this.addIntro();
        }

        ag.ui.field.Select.prototype.setOptions.call(this, options);

        if (this.currentValue && this.containsOption(this.currentValue))
            this.setValue(this.currentValue);
        else
            this.currentValue = null;
    };

    // add an entity which is part of a parent entity and might not be in the
    // retrieved entity list (e.g. because it's "deleted")
    entitySelectField.prototype.addEntity = function(entity)
    {
        this.entities.add(entity);
        this.refresh();
    };

    // hide an entity, e.g. because it was inserted in a different view element
    entitySelectField.prototype.hideEntity = function(entity)
    {
        this.hiddenEntities.indexOf(getId(entity)) === -1 && this.hiddenEntities.push(getId(entity));
        this.refresh();
    };

    // unhide a previously hidden entity
    entitySelectField.prototype.unhideEntity = function(entity)
    {
        this.hiddenEntities.splice(this.hiddenEntities.indexOf(getId(entity)), 1);
        this.refresh();
    };

    // hide a fixed set of entities (and only that set)
    entitySelectField.prototype.hideEntities = function(entities)
    {
        this.hiddenEntities = entities.map(entity => getId(entity));
        this.refresh();
    };

    // hide all available entities
    entitySelectField.prototype.hideAllEntities = function()
    {
        this.hiddenEntities = this.entities.getList().map(function(entity){ return entity.id; });
        this.refresh();
    };

    // unhide all previously hidden entities
    entitySelectField.prototype.unhideAllEntities = function()
    {
        this.hiddenEntities = [];
        this.refresh();
    };

    // returns the number of selectable items
    entitySelectField.prototype.getCount = function()
    {
        return this.entities.length - this.hiddenEntities.length;
    };

    ag.admin.field.LoadableEntitySelect = entitySelectField;
})();
