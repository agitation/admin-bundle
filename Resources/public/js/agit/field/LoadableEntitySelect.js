agit.ns("agit.field");

(function(){
    var
        getId = function(entity)
        {
            return (entity && entity.id !== undefined) ?
                entity.id : entity;
        },

        entitySelectField = function(objectName, $select, nullOption)
        {
            var
                self = this,
                dummyEntity = new agit.api.Object(objectName);

            this.extend(this, agit.field.EntitySelect.call(this, $select));

            this.hiddenEntities = [];
            this.nullOption = nullOption;

            if (dummyEntity.getPropMeta("id").type === "number")
                this.attr("data-type", "int");

            agit.srv("preloader").loadEntity(objectName, function(entities){
                self.entities = new agit.common.Collection(entities);
                self.refresh();
            });
        };

    entitySelectField.prototype = Object.create(agit.field.EntitySelect.prototype);

    entitySelectField.prototype.refresh = function()
    {
        var
            self = this,
            list = this.entities.sort().filter(function(entity){
                return self.hiddenEntities.indexOf(entity.id) === -1;
            }),

            options = this.entitiesToOptions(list);

        this.empty();

        if (this.nullOption)
            options.unshift({ value: "", text: this.nullOption });
        else
            this.addIntro();


        agit.field.Select.prototype.setOptions.call(this, options);
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

    agit.field.LoadableEntitySelect = entitySelectField;
})();
