ag.ns("ag.admin.field");

(function(){
    var
        toggleList = function(on)
        {
            if (on)
            {
                this.$emptyHint.hide();
                this.$list.show();
            }
            else
            {
                this.$list.hide();
                this.$emptyHint.show();
            }
        },

        oneToManyField = function($list, $add)
        {
            this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".sublist"));

            this.$list = $list;
            this.$add = $add;
            this.$emptyHint = this.find("p.empty");

            this.find(".add").remove();
            this.append([$list, $add]);

            $add.onAdd(obj => {
                $list.addRow($list.createRow(obj));
                toggleList.call(this, 1);
            });

            $list.onRemove(obj => {
                $add.objectRemoved(obj);
                toggleList.call(this, $list.getCount());
            });
        };

    oneToManyField.prototype = Object.create(ag.ui.field.Field.prototype);

    oneToManyField.prototype.setValue = function(value)
    {
        toggleList.call(this, value.length);
        this.$list.setValue(value);
        this.$add.reset();

        value.forEach(obj => {
            this.$add.objectAdded(obj);
        });

        return this;
    };

    oneToManyField.prototype.getValue = function()
    {
        return this.$list.getValue();
    };

    ag.admin.field.OneToMany = oneToManyField;
})();
