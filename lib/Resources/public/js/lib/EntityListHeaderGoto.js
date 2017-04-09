ag.ns("ag.admin");

ag.admin.EntityListHeaderGoto = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".action.goto"));

    var input = new ag.ui.field.Text(this.find("input"));

    this.submit(ev => {
        var id = input.getValue();
        id && ag.srv("state").switchTo("/edit", id);
        ev.preventDefault();
    });
};

ag.admin.EntityListHeaderGoto.prototype = Object.create(jQuery.prototype);
