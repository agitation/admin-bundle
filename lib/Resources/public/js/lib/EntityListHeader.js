ag.ns("ag.admin");

(function(){

var entityListHeader = function(entityName, actions)
{
    ag.ui.elem.Title.call(this, entityName);
    this.find(".actions").html(actions);
};

entityListHeader.prototype = Object.create(ag.ui.elem.Title.prototype);

entityListHeader.prototype.nodify = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-header"));
    this.textTarget = this.find("h1 span");
};

ag.admin.EntityListHeader = entityListHeader;


})();
