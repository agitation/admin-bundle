ag.ns("ag.admin.field");

(function(){
    var
        sublistAddField = function(entityName, childEntityName, childEntityPropertyName)
        {
            this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".sublist-add"));

            var $selectField = this.find("select");

            if (childEntityName && childEntityPropertyName)
                this.$select = new ag.admin.field.LoadableEntitySelect(childEntityName, $selectField);
            else
                $selectField.remove();

            this.childEntityPropertyName = childEntityPropertyName;

            this.find("button").click(ev => {
                var
                    data = {},
                    obj,
                    selected;

                if (this.$select)
                    data[childEntityPropertyName] = selected = this.$select.getSelectedEntity() || null;

                if (selected || selected === undefined)
                {
                    obj = new ag.api.Object(entityName, data);
                    this.trigger("ag.admin.sublist.add", obj);
                }
            });

            this.on("ag.admin.sublist.add", (ev, obj) => {
                if (this.childEntityPropertyName && obj[this.childEntityPropertyName])
                {
                    this.$select.hideEntity(obj[this.childEntityPropertyName]);
                    (this.$select && this.$select.getCount()) || this.hide();
                }
            });

            this.on("ag.admin.sublist.remove", (ev, obj) => {
                if (this.childEntityPropertyName && obj[this.childEntityPropertyName])
                {
                    this.$select.unhideEntity(obj[this.childEntityPropertyName]);
                    this.show();
                }
            });
        };

    sublistAddField.prototype = Object.create(ag.ui.field.Field.prototype);

    sublistAddField.prototype.reset = function()
    {
        if (this.$select)
        {
            this.$select.unhideAllEntities();
            this.show();
        }
    };

    ag.admin.field.SublistAdd = sublistAddField;
})();
