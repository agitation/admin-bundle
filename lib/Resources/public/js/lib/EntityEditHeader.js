ag.ns("ag.admin");

(function(){
var
    entityEditHeader = function(entityName)
    {
        ag.ui.elem.Title.call(this, entityName);

        this.find(".back").click(ev => {
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
};

entityEditHeader.prototype.setText = function(text)
{
    this.find("h1 span").text(text);
};

entityEditHeader.prototype.setRelativeBacklink = function(state)
{
    this.relBacklink = state;
};

ag.admin.EntityEditHeader = entityEditHeader;

})();
