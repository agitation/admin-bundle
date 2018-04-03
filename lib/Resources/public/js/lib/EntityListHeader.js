ag.ns("ag.admin");

(function(){

var entityListHeader = function(entityName, actions)
{
    ag.admin.Title.call(this, entityName);
    this.find(".actions").html(actions);
};

entityListHeader.prototype = Object.create(ag.admin.Title.prototype);

entityListHeader.prototype.nodify = function()
{
    this.extend(this, ag.u.tpl("agitadmin-listview", ".listview-header"));
    this.textTarget = this.find("h1 span");
};

ag.admin.EntityListHeader = entityListHeader;


})();
