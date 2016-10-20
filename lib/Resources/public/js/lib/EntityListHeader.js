ag.ns("ag.admin");

(function(){

var entityListHeader = function(entityName, hideCreate, hideEdit)
{
    ag.ui.elem.Title.call(this, entityName);

    var
        createAction = this.find(".action.create"),
        switchToEditAction = this.find(".action.goto"),
        input = new ag.ui.field.Number(switchToEditAction.find("input"), { min : 0 });

    hideCreate && createAction.hide();
    hideEdit && switchToEditAction.hide();

    switchToEditAction.submit(function(ev){
        ev.preventDefault();
        var id = input.getValue();
        id && ag.srv("state").switchTo("/edit", id);
    });
};

entityListHeader.prototype = Object.create(ag.ui.elem.Title.prototype);

entityListHeader.prototype.nodify = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-header"));
};

entityListHeader.prototype.setText = function(text)
{
    this.find("h1 span").text(text);
};

ag.admin.EntityListHeader = entityListHeader;


})()
