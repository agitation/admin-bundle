ag.ns("ag.admin");

ag.admin.EntityListHeaderCreate = function()
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".action.create"));
};

ag.admin.EntityListHeaderCreate.prototype = Object.create(jQuery.prototype);
