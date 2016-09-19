ag.ns("ag.admin.field");

(function(){
    var
        tags = function(entityName)
        {
            this.extend(this, $("<div>"));
            this.tags = {};

            ag.srv("preloader").loadEntity(entityName, result => {
                result.forEach(entity => {
                    this.tags[entity.id] = new ag.admin.field.Tag(entity);
                    this.append(this.tags[entity.id]);
                });
            });
        };

    tags.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    tags.prototype.setValue = function(value)
    {
        var valMap = value ? value.map(entity => entity.id) : [],
        Object.keys(this.tags).forEach(id => this.tags[id].setValue(ids.indexOf(id) >= 0) && this.tags[id].unlock());
        return this.triggerHandler("ag.field.set");
    };

    tags.prototype.getValue = function()
    {
        var tags = [];

        Object.keys(this.tags).forEach(id => {
            this.tags[id].getValue() && tags.push(id);
        });

        return tags;
    };

    ag.admin.field.Tags = tags;
})();
