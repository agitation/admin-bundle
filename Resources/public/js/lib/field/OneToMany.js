ag.ns("ag.admin.field");

(function(){
    var
        toggleList = function(on)
        {
            if (on)
            {
                this.emptyHint.hide();
                this.list.show();
            }
            else
            {
                this.list.hide();
                this.emptyHint.show();
            }
        },

        oneToManyField = function($list, $add, $tpl)
        {
            this.extend(this, $tpl || ag.ui.tool.tpl("agitadmin-forms", ".sublist"));

            this.list = $list;
            this.add = $add;
            this.emptyHint = this.find("p.empty");

            this.append([$list, $add]);

            $add.on("ag.admin.sublist.add", (ev, obj) => {
                $list.addRow($list.createRow(obj));
                toggleList.call(this, 1);
            });

            $list.on("ag.admin.sublist.remove", (ev, $row) => {
                $add.trigger("ag.admin.sublist.remove", [$row]);
                toggleList.call(this, $list.getCount());
            });
        };

    oneToManyField.prototype = Object.create(ag.ui.field.Field.prototype);

    oneToManyField.prototype.setValue = function(value)
    {
        this.list.setValue([]);
        this.add.reset();
        value.forEach(obj => this.add.trigger("ag.admin.sublist.add", obj));

        return this;
    };

    oneToManyField.prototype.getValue = function()
    {
        return this.list.getValue();
    };

    ag.admin.field.OneToMany = oneToManyField;
})();
