agit.ns("agit.elem");

agit.elem.ObjectListHeader = function()
{
    var
        $elem = agit.tool.tpl("agitadmin-listview", ".listview-header"),
        $editForm = $elem.find("form"),
        $input = new agit.field.Number($editForm.find("input"), { min : 0 });

    $editForm.submit(function(ev){
        var id = $input.getValue();

        agit.common.Form.stopEvent(ev);
        id && agit.srv("state").switchTo("/edit/form", id);
    });

    return $elem;
};
