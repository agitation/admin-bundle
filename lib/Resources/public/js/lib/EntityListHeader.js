ag.ns("ag.admin");

ag.admin.EntityListHeader = function(entityName, hideCreate, hideEdit)
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-header"));
    this.find("h1 span").text(entityName);

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

ag.admin.EntityListHeader.prototype = Object.create(ag.ui.ctxt.Block.prototype);
