ag.ns("ag.admin");

(function(){

var
    entityListTable = function(columns, actions)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-table"));

        var table = this.find("table");

        this.columns = columns;
        this.actions = actions;

        this.tfoot = table.find("tfoot");
        this.footTr = this.tfoot.find("tr");

        this.headTr = table.find("thead tr");
        this.tbody = table.find("tbody");
        this.entities = new ag.common.Collection();
        this.rowCount = 0;

        Object.keys(this.columns).forEach(key => this.headTr.append(
            $("<th>")
                .addClass(this.columns[key].style + " priority-" + this.columns[key].priority)
                .html(this.columns[key].title)
        ));

        this.actions.length && this.headTr.append($("<th class='actions'>").text(ag.intl.t("Actions")));
        showNoResultsRow.call(this);
    },

    fillRow = function($row, item)
    {
        $row.empty();

        if (item.deleted)
            $row.addClass("deleted");
        else
            $row.removeClass("deleted");

        Object.keys(this.columns).forEach(key => {
            var column = this.columns[key];

            $("<td>")
                .addClass(column.style + " priority-" + column.priority)
                .html(column.filter ? column.filter(item, key, column) : item[key])
                .appendTo($row);
        });

        if (this.actions.length)
        {
            var $actionTd = $("<td class='actions'>");

            this.actions.forEach(action => {
                var
                    $link = $("<a>").append(
                        $("<i>").addClass(action.icon),
                        $("<span>").text(action.title)
                    );

                $link.getTable = () => this;

                action.generate($link, item, action);
                $actionTd.append($link);
            });

            $row.append($actionTd);
        }
    },

    renumberRows = function(rows)
    {
        this.rowCount = 0;

        rows.each(function(){
            ++this.rowCount;
            $(this).attr("data-num", this.rowCount).find("td[data-name=num]").text(this.rowCount);
        });
    },

    updateFooter = function()
    {
        this.tfoot.hide();
        this.footTr.empty();
    },

    showNoResultsRow = function()
    {
        var $row = ag.ui.tool.tpl("agitadmin-listview", "tr.noresults");

        $row.find("td").attr("colspan", Object.keys(this.columns).length + (this.actions.length ? 1 : 0));

        this.tbody.html($row);
        updateFooter.call(this);
    };

entityListTable.prototype = Object.create(ag.ui.ctxt.Block.prototype);

entityListTable.prototype.truncate = function()
{
    this.entities.truncate();
    this.tbody.empty();
    this.rowCount = 0;
    updateFooter.call(this);
    showNoResultsRow.call(this);
};

entityListTable.prototype.getItems = function()
{
    return this.entities;
};

entityListTable.prototype.contains = function(id)
{
    return (id && this.entities.get(id));
};

entityListTable.prototype.addItem = function(item)
{
    var $row = $("<tr>").attr({ "data-num" : ++this.rowCount, "data-id": item.id });

    this.entities.length || this.tbody.empty();
    this.entities.add(item);
    fillRow.call(this, $row, item);
    updateFooter.call(this);
    $row.appendTo(this.tbody);
};

entityListTable.prototype.updateItem = function(item)
{
    var $row = this.tbody.find("tr[data-id=" + item.id + "]");

    this.entities.update(item);
    fillRow.call(this, $row, item);
    updateFooter.call(this);
};

entityListTable.prototype.removeItem = function(id)
{
    this.entities.remove(id);
    this.tbody.find("tr[data-id=" + id + "]").remove();

    renumberRows(this.tbody.find("tr[data-num]"));
    updateFooter.call(this);
    this.entities.length || showNoResultsRow.call(this);
};

entityListTable.createColumn = function(params)
{
    return $.extend({}, entityListTable._columnTpl, params);
};

entityListTable.registerColumn = function(name, params)
{
    entityListTable._columns[name] = entityListTable.createColumn(params);
};

entityListTable.getColumn = function(name, extra)
{
    return $.extend({}, entityListTable._columns[name], extra || {});
};

entityListTable.createAction = function(params)
{
    return $.extend({}, entityListTable._actionTpl, params);
};

entityListTable.registerAction = function(name, params)
{
    entityListTable._actions[name] = entityListTable.createAction(params);
};

entityListTable.getAction = function(name, extra)
{
    return $.extend({}, entityListTable._actions[name], extra || {});
};

entityListTable._columnTpl = { title : "", filter : () => {}, style : "", priority : 2 };
entityListTable._columns = {};

entityListTable._actionTpl = { title : "", href : "", generate : () => {}, icon : "", params : {} };
entityListTable._actions = {};

ag.admin.EntityListTable = entityListTable;

})();
