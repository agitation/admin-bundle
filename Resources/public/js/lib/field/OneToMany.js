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
            toggleList.call(this, false);

            this.on("ag.admin.sublist.add", (ev, obj) => {
                $list.triggerHandler("ag.admin.sublist.add", obj);
                toggleList.call(this, true);
            });

            this.on("ag.admin.sublist.remove", (ev, obj) => {
                $add.triggerHandler("ag.admin.sublist.remove", obj);
                toggleList.call(this, $list.getCount());
            });
        };

    oneToManyField.prototype = Object.create(ag.ui.field.Field.prototype);

    oneToManyField.prototype.setValue = function(value)
    {
        toggleList.call(this, value.length);
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
