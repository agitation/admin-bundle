ag.ns("ag.admin.field");

(function(){
    var
        sublistAddField = function(entityName, childEntityName, childEntityPropertyName)
        {
            this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".sublist-add"));

            var selectField = this.find("select");

            if (childEntityName && childEntityPropertyName)
                this.selectField = new ag.admin.field.LoadableEntitySelect(selectField, childEntityName);
            else
                selectField.remove();

            this.childEntityPropertyName = childEntityPropertyName;

            this.find("button").click(() => {
                var
                    data = {},
                    obj,
                    selected;

                if (this.selectField)
                    data[childEntityPropertyName] = selected = this.selectField.getSelectedEntity() || null;

                if (selected || selected === undefined)
                {
                    obj = new ag.api.Object(entityName, data);
                    this.trigger("ag.admin.sublist.add", obj);
                }
            });

            if (this.childEntityPropertyName)
            {
                this.on("ag.admin.sublist.add", (ev, obj) => {
                    if (!obj[this.childEntityPropertyName]) return;

                    this.selectField.hideEntity(obj[this.childEntityPropertyName]);
                    this.selectField.getCount() || this.hide();
                });

                this.on("ag.admin.sublist.remove", (ev, obj) => {
                    if (!obj[this.childEntityPropertyName]) return;

                    this.selectField.unhideEntity(obj[this.childEntityPropertyName]);
                    this.show();
                });
            }
        };

    sublistAddField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    sublistAddField.prototype.reset = function()
    {
        if (this.selectField)
        {
            this.selectField.unhideAllEntities();
            this.show();
        }
    };

    ag.admin.field.SublistAdd = sublistAddField;
})();
