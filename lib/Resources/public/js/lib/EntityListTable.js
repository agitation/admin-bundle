ag.ns("ag.admin");

(function(){

var EntityListTable = function(columns, actions)
{
    this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-table"));

    var table = this.find("table");

    this.columns = columns;
    this.actions = actions;

    this.headTr = table.find("thead tr");
    this.tbody = table.find("tbody");
    this.tfoot = table.find("tfoot");
    this.footTr = this.tfoot.find("tr");

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
                $link = $("<a>")
                    .addClass(action.style)
                    .append($("<i>").addClass(action.icon), $("<span>").text(action.title));

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

EntityListTable.prototype = Object.create(ag.ui.ctxt.Block.prototype);

EntityListTable.prototype.truncate = function()
{
    this.entities.truncate();
    this.tbody.empty();
    this.rowCount = 0;
    updateFooter.call(this);
    showNoResultsRow.call(this);
};

EntityListTable.prototype.getItems = function()
{
    return this.entities;
};

EntityListTable.prototype.contains = function(id)
{
    return (id && this.entities.get(id));
};

EntityListTable.prototype.addItem = function(item)
{
    var $row = $("<tr>").attr({ "data-num" : ++this.rowCount, "data-id": item.id });

    this.entities.length || this.tbody.empty();
    this.entities.add(item);
    fillRow.call(this, $row, item);
    updateFooter.call(this);
    $row.appendTo(this.tbody);
};

EntityListTable.prototype.updateItem = function(item)
{
    var $row = this.tbody.find("tr[data-id=" + item.id + "]");

    this.entities.update(item);
    fillRow.call(this, $row, item);
    updateFooter.call(this);
};

EntityListTable.prototype.removeItem = function(id)
{
    this.entities.remove(id);
    this.tbody.find("tr[data-id=" + id + "]").remove();

    renumberRows(this.tbody.find("tr[data-num]"));
    updateFooter.call(this);
    this.entities.length || showNoResultsRow.call(this);
};

EntityListTable.createColumn = function(params)
{
    return $.extend({}, EntityListTable._columnTpl, params);
};

EntityListTable.registerColumn = function(name, params)
{
    EntityListTable._columns[name] = EntityListTable.createColumn(params);
};

EntityListTable.getColumn = function(name, extra)
{
    return $.extend({}, EntityListTable._columns[name], extra || {});
};

EntityListTable.createAction = function(params)
{
    return $.extend({}, EntityListTable._actionTpl, params);
};

EntityListTable.registerAction = function(name, params)
{
    EntityListTable._actions[name] = EntityListTable.createAction(params);
};

EntityListTable.getAction = function(name, extra)
{
    return $.extend({}, EntityListTable._actions[name], extra || {});
};

EntityListTable._columnTpl = { title : "", filter : () => {}, style : "", priority : 2 };
EntityListTable._columns = {};

EntityListTable._actionTpl = { title : "", href : "", style : "", generate : () => {}, icon : "", params : {} };
EntityListTable._actions = {};

ag.admin.EntityListTable = EntityListTable;

})();
