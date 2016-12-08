ag.ns("ag.admin.field");

(function(){
    var
        oneToManyEntityFooter = function(entityName, childEntityName, childEntityPropertyName, nameFilter)
        {
            ag.admin.field.OneToManyFooter.call(this, entityName);

            this.selectField = this.selectField || new ag.admin.field.LoadableEntitySelect(this.find("select"), childEntityName, null, nameFilter);
            this.childEntityPropertyName = childEntityPropertyName;

            this.on("ag.admin.onetomany.add", (ev, obj) => {
                if (!obj[childEntityPropertyName]) return;
                this.selectField.hideEntity(obj[childEntityPropertyName]);
                this.selectField.getCount() || this.hide();
            });

            this.on("ag.admin.onetomany.remove", (ev, obj) => {
                if (!obj[childEntityPropertyName]) return;
                this.show().selectField.unhideEntity(obj[childEntityPropertyName]);
            });
        };

    oneToManyEntityFooter.prototype = Object.create(ag.admin.field.OneToManyFooter.prototype);

    oneToManyEntityFooter.prototype.reset = function()
    {
        this.show().selectField.unhideAllEntities();
    };

    oneToManyEntityFooter.prototype.getValue = function()
    {
        var
            value = null,
            selected = this.selectField.getSelectedEntity();

        if (selected)
        {
            value = new ag.api.Object(this.entityName);
            value[this.childEntityPropertyName] = selected;
        }

        return value;
    };

    ag.admin.field.OneToManyEntityFooter = oneToManyEntityFooter;
})();
