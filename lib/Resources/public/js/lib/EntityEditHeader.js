ag.ns("ag.admin");

(function(){
var
    entityEditHeader = function(entityName)
    {
        ag.app.Title.call(this, entityName);
    };

entityEditHeader.prototype = Object.create(ag.app.Title.prototype);

entityEditHeader.prototype.nodify = function()
{
    this.extend(this, ag.u.tpl("agitadmin-editview", ".editview-header"));
    this.textTarget = this.find("h1 span");
};

entityEditHeader.prototype.setRelativeBacklink = function()
{
    this.find("a.back")
        .attr("href", null)
        .click(ev => {
            ev.preventDefault();
            history.go(-1);
        });
};

ag.admin.EntityEditHeader = entityEditHeader;

})();
