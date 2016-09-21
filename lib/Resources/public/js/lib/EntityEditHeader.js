ag.ns("ag.admin");

(function(){
var
    entityEditHeader = function(entityName)
    {
        this.nodify();

        this.find("h2 span").text(entityName);

        this.find("a").click(ev => {
            if (this.relBacklink)
            {
                ev.preventDefault();
                history.go(-1);
            }
        });
    };

entityEditHeader.prototype = Object.create(ag.ui.ctxt.Block.prototype);

entityEditHeader.prototype.nodify = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editview-header"));
};

entityEditHeader.prototype.setRelativeBacklink = function(state)
{
    this.relBacklink = state;
};

ag.admin.EntityEditHeader = entityEditHeader;

})();
