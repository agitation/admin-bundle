ag.ns("ag.admin.field");

(function(){
    var
        tags = function(entityName)
        {
            this.extend(this, $("<div>"));
            this.tags = {};
            this.entities = new ag.common.Collection();

            ag.srv("preloader").loadEntity(entityName, result => {
                result.forEach(entity => {
                    this.tags[entity.id] = new ag.admin.field.Tag(entity);
                    this.append(this.tags[entity.id]);
                    this.entities.add(entity);
                });
            });
        };

    tags.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    tags.prototype.setValue = function(value)
    {
        var valMap = value ? value.map(entity => entity.id) : [];

        Object.keys(this.tags).forEach(id => {
            var entity = this.entities.get(id);
            this.tags[id].setValue(valMap.indexOf(entity.id) >= 0) && this.tags[id].unlock();
        });

        return this.triggerHandler("ag.field.set");
    };

    tags.prototype.getValue = function()
    {
        var tags = [];

        Object.keys(this.tags).forEach(id => {
            var entity = this.entities.get(id);
            this.tags[id].getValue() && tags.push(entity.id);
        });

        return tags;
    };

    ag.admin.field.Tags = tags;
})();
