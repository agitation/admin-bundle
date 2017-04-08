ag.ns("ag.admin.field");

(function(){
var entitySelectField = function(elem, objectName, autofill, nullOption, nameFilter)
    {
        var entityType = new ag.api.Object(objectName).getPropMeta("id").type;


        this.hiddenEntities = [];
        this.nullOption = nullOption;
        this.autofill = autofill && !nullOption;

        ag.srv("preloader").loadEntity(objectName, entities => {
            this.entities = new ag.common.Collection(entities);
            this.refresh();
            this.trigger("ag.field.loaded");
        });

        ag.ui.field.EntitySelect.call(this, elem, null, nameFilter, entityType === "integer");
    },

    getId = function(entity)
    {
        return (entity && entity.id !== undefined) ?
            entity.id : entity;
    };

    entitySelectField.prototype = Object.create(ag.ui.field.EntitySelect.prototype);

    entitySelectField.prototype.setValue = function(value)
    {
        if (!value && this.autofill && this.entities.length - this.hiddenEntities.length === 1)
        {
            this.entities.getList().some(entity => {
                if (this.hiddenEntities.indexOf(entity.id) < 0)
                    /* jshint boss:true */
                    return value = entity;
            });
        }

        ag.ui.field.EntitySelect.prototype.setValue.call(this, value);
    };

    entitySelectField.prototype.refresh = function()
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
