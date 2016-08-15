ag.ns("ag.admin.field");

(function(){
    var
        oneToManyFooter = function(entityName)
        {
            this.nodify();
            this.entityName = entityName;

            this.find("button").click(() => {
                var value = this.getValue();
                value && this.trigger("ag.admin.onetomany.add", value);
            });
        };

    oneToManyFooter.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    oneToManyFooter.prototype.reset = function() {};

    oneToManyFooter.prototype.setValue = function(value) { };

    oneToManyFooter.prototype.getValue = function()
    {
        return new ag.api.Object(this.entityName);
    };

    ag.admin.field.OneToManyFooter = oneToManyFooter;
})();
