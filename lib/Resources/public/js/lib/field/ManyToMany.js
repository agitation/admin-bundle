ag.ns("ag.admin.field");

(function(){
    var
        defaultNameFilter = object => ag.ui.tool.fmt.out(object.name),

        manyToManyField = function(objectName, nameFilter)
        {
            this.nodify();
            this.nameFilter = nameFilter || defaultNameFilter;

            this.select = new ag.admin.field.LoadableEntitySelect(this.find("select"), objectName, null, nameFilter);
            this.add = this.find("button");

            this.caption = this.find("caption");
            this.list = this.find("tbody");
            this.entities = new ag.common.Collection();

            this.add.click(() => {
                var entity = this.select.getSelectedEntity();
                entity && this.addRow(entity);
            });
        };

    manyToManyField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    manyToManyField.prototype.nodify = function()
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".manytomany"));
    };

    manyToManyField.prototype.setValue = function(value)
    {
        this.entities.truncate();
        this.list.empty();
        this.select.unhideAllEntities();

        value.forEach(entity => this.addRow(entity));

        this.triggerHandler("ag.field.set");
        return this;
    };

    manyToManyField.prototype.getValue = function()
    {
        return this.entities.getList().map(entity => entity.id);
    };

    manyToManyField.prototype.addRow = function(entity)
    {
        var row = ag.ui.tool.tpl("agitadmin-forms", ".manytomany-row");

        row.find("td").first().text(this.nameFilter(entity)).addClass(entity.deleted ? "deleted" : "");

        this.list.append(row);
        this.select.hideEntity(entity);
        this.entities.add(entity);
        this.removeClass("empty");

        row.find(".remove a").click(() => {
            this.entities.remove(entity);
            this.select.unhideEntity(entity);
            row.remove();
            this.entities.length || this.addClass("empty");
        });
    };

    ag.admin.field.ManyToMany = manyToManyField;
})();
