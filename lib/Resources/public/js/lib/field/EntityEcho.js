ag.ns("ag.admin.field");

(function(){
var EntityEcho = function(elem, nameFilter)
{
    this.extend(this, elem || $("<span>"));
    this.value = null;
    this.nameFilter = nameFilter || defaultNameFilter;
},

defaultNameFilter = function(value)
{
    var name = "–";

    if (value instanceof Object && value.id)
        name = value.name ? ag.u.out(value.name) : value.id;

    else if (ag.vld.isValid("integer", value, 1))
        name = value;

    return name;
};

EntityEcho.prototype = Object.create(ag.admin.field.Echo.prototype);

EntityEcho.prototype.setValue = function(value)
{
    this.value = (value instanceof Object && value.id) ? value.id : value;
    this.text(this.nameFilter(value));
    this.triggerHandler("ag.field.set");
    return this;
};

ag.admin.field.EntityEcho = EntityEcho;
})();
