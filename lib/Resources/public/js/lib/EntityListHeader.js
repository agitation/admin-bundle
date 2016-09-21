ag.ns("ag.admin");

ag.admin.EntityListHeader = function(entityName)
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-header"));
    this.find("h2 span").text(entityName);

    var
        editForm = this.find("form"),
        input = new ag.ui.field.Number(editForm.find("input"), { min : 0 });

    editForm.submit(function(ev){
        ev.preventDefault();
        var id = input.getValue();
        id && ag.srv("state").switchTo("/edit", id);
    });
};

ag.admin.EntityListHeader.prototype = Object.create(ag.ui.ctxt.Block.prototype);
