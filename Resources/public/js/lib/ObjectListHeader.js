ag.ns("ag.admin");

ag.admin.ObjectListHeader = function()
{
    var
        $elem = ag.ui.tool.tpl("agitadmin-listview", ".listview-header"),
        $editForm = $elem.find("form"),
        $input = new ag.ui.field.Number($editForm.find("input"), { min : 0 });

    $editForm.submit(function(ev){
        var id = $input.getValue();

        ag.ui.ctxt.Form.prototype.stopEvent(ev);
        id && ag.srv("state").switchTo("/edit", id);
    });

    return $elem;
};

ag.admin.ObjectListHeader.prototype = Object.create(jQuery.prototype);
