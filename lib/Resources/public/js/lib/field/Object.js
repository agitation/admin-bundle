ag.ns("ag.admin.field");

(function(){

// generic field which works well for key-value objects
var object = function() { };

object.prototype = Object.create(ag.ui.field.ComplexField.prototype);

object.prototype.setValue = function(value)
{
    Object.keys(this.props).forEach(name => this.props[name].setValue(value[name]));
    this.triggerHandler("ag.field.set");
    return this;
};

object.prototype.getValue = function()
{
    var value = {};

    Object.keys(this.props).forEach(name => {
        value[name] = this.props[name].getValue();
    });

    return value;
};

object.prototype.props = {};

ag.admin.field.Object = object;

})();
