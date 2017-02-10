ag.ns("ag.admin");

(function(){
var
    entityEditHeader = function(entityName)
    {
        ag.ui.elem.Title.call(this, entityName);

        this.find(".back a").click(ev => {
            if (this.relBacklink)
            {
                ev.preventDefault();
                history.go(-1);
            }
        });
    };

entityEditHeader.prototype = Object.create(ag.ui.elem.Title.prototype);

entityEditHeader.prototype.nodify = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editview-header"));
    this.textTarget = this.find("h1 span");
};

entityEditHeader.prototype.setRelativeBacklink = function(state)
{
    this.relBacklink = state;
};

ag.admin.EntityEditHeader = entityEditHeader;

})();
