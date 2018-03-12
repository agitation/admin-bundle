ag.ns("ag.admin.field");

(function(){

var Echo = function(elem)
    {
        this.extend(this, elem || $("<span>"));
        this.value = undefined;
    };

Echo.prototype = Object.create(ag.ui.field.ComplexField.prototype);

Echo.prototype.setValue = function(value)
{
    this.text(ag.u.out(value));
    this.value = value;
    this.triggerHandler("ag.field.set");
    return this;
};

Echo.prototype.getValue = function()
{
    return this.value;
};

ag.admin.field.Echo = Echo;

})();
