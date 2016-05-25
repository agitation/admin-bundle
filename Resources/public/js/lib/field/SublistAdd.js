ag.ns("ag.admin.field");

(function(){
    var
        sublistAddField = function(entityName, childEntityName, childEntityPropertyName)
        {
            this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".sublist .add"));

            var
                self = this,
                $selectField = this.find("select");

            if (childEntityName && childEntityPropertyName)
                this.$select = new ag.admin.field.LoadableEntitySelect(childEntityName, $selectField);
            else
                $selectField.remove();

            this.onAddCallback = function(){};
            this.childEntityPropertyName = childEntityPropertyName;

            this.find("button").click(function(){
                var
                    data = {},
                    obj,
                    selected;

                if (self.$select)
                    data[childEntityPropertyName] = selected = self.$select.getSelectedEntity() || null;

                if (selected !== null)
                {
                    obj = new ag.api.Object(entityName, data);
                    self.objectAdded(obj);
                    self.onAddCallback(obj);
                }
            });
        };

    sublistAddField.prototype = Object.create(ag.ui.field.Field.prototype);

    // registers callbacks to the adding event
    sublistAddField.prototype.onAdd = function(callback)
    {
        this.onAddCallback = callback;
    };

    // triggered when an object has been removed from the list
    sublistAddField.prototype.objectAdded = function(obj)
    {
        if (this.childEntityPropertyName && obj[this.childEntityPropertyName])
        {
            this.$select.hideEntity(obj[this.childEntityPropertyName]);
            this.$select.getCount() || this.hide();
        }
    };

    // triggered when an object has been added to the list
    sublistAddField.prototype.objectRemoved = function(obj)
    {
        if (this.childEntityPropertyName && obj[this.childEntityPropertyName])
        {
            this.$select.unhideEntity(obj[this.childEntityPropertyName]);
            this.show();
        }
    };

    sublistAddField.prototype.reset = function()
    {
        this.$select && this.$select.unhideAllEntities();
    };

    ag.admin.field.SublistAdd = sublistAddField;
})();
