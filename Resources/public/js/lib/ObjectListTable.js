ag.ns("ag.admin");

ag.admin.ObjectListTable = function(exporter, columns, actions)
{
    var
        $elem = ag.ui.tool.tpl("agitadmin-listview", ".listview-table"),
        $table = $elem.find("table"),
        $tbody = $table.find("tbody"),
        $header = $table.find("thead tr"),
        $tfoot = $table.find("tfoot"),
        $footer = $tfoot.find("tr"),

        entities = new ag.common.Collection(),
        rowCount = 0,

        fillRow = function($row, item)
        {
            $row.empty();

            Object.keys(columns).forEach(function(key){
                var
                    column = columns[key];

                $("<td>")
                    .addClass(column.style)
                    .html(column.filter ? column.filter(item, key) : item[key])
                    .appendTo($row);
            });

            if (actions.length)
            {
                var $actionTd = $("<td class='actions'>");

                actions.forEach(function(action){
                    var
                        $link = $("<a>").append(
                            $("<i>").addClass(action.icon),
                            $("<span>").text(action.title)
                        );

                    $link.getTable = function(){ return $elem; };

                    action.createAction($link, item);
                    $actionTd.append($link);
                });

                $row.append($actionTd);
            }
        },

        renumberRows = function()
        {
            rowCount = 0;
            $("tr[data-num]").each(function(){
                ++rowCount;
                $(this).attr("data-num", rowCount).find("td[data-name=num]").text(rowCount);
            });
        },

        updateFooter = function()
        {
            $tfoot.hide();
            $footer.empty();
        };

    $elem.truncate = function()
    {
        entities.truncate();
        $tbody.empty();
        rowCount = 0;
        updateFooter();
        $elem.showNoResultsRow();
    };

    $elem.getItems = function()
    {
        return entities;
    };

    $elem.addItem = function(item)
    {
        var $row = $("<tr>").attr({ "data-num" : ++rowCount, "data-id": item.id });

        entities.length || $tbody.empty();
        entities.add(item);
        fillRow($row, item);
        $row.appendTo($tbody);
        updateFooter();
    };

    $elem.updateItem = function(item)
    {
        var $row = $tbody.find("tr[data-id=" + item.id + "]");

        entities.update(item);
        fillRow($row, item);
        updateFooter();
    };

    $elem.removeItem = function(id)
    {
        entities.remove(id);
        $tbody.find("tr[data-id=" + id + "]").remove();

        renumberRows();
        updateFooter();
        entities.length || $elem.showNoResultsRow();
    };

    $elem.showNoResultsRow = function()
    {
        var $row = ag.ui.tool.tpl("agitadmin-listview", "tr.noresults");

        $row.find("td").attr("colspan", Object.keys(columns).length + (actions.length ? 1 : 0));

        $tbody.html($row);
        updateFooter(true);
    };

    Object.keys(columns).forEach(function(key) {
        $header.append($("<th>").addClass(columns[key].style).text(columns[key].title));
    });

    actions.length && $header.append($("<th class='actions'>").text(ag.intl.t("Actions")));
    $elem.showNoResultsRow();

    return $elem;
};

ag.admin.ObjectListTable.getFilter = function(name)
{
    return ag.admin.ObjectListTable._filters[name];
};

ag.admin.ObjectListTable.getColumn = function(name, extra)
{
    return $.extend(
        {},
        ag.admin.ObjectListTable._columnTpl,
        ag.admin.ObjectListTable._columns[name],
        extra || {});
};

ag.admin.ObjectListTable.createColumn = function(options)
{
    return $.extend(
        {},
        ag.admin.ObjectListTable._columnTpl,
        options);
};

ag.admin.ObjectListTable.getAction = function(name, extra)
{
    return $.extend(
        {},
        ag.admin.ObjectListTable._actionTpl,
        ag.admin.ObjectListTable._actions[name],
        extra || {});
};

ag.admin.ObjectListTable._columnTpl = { name : null, filter : function(){}, style : "", secondary : false };
ag.admin.ObjectListTable._actionTpl = { title : "", href : "", createAction : function(){}, icon : "" };

ag.admin.ObjectListTable._filters =
{
    id : function(item)
    {
        return $("<span class='id'></span>").text(item.id);
    },

    text : function(item, fieldName)
    {
        return ag.ui.tool.fmt.out(item[fieldName]);
    },

    code : function(item, fieldName)
    {
        return "<code>" + item[fieldName] + "</code>";
    },

    childId : function(item, fieldName)
    {
        return item[fieldName].id;
    },

    childName : function(item, fieldName)
    {
        return item[fieldName] ? ag.ui.tool.fmt.out(item[fieldName].name) : "–";
    },

    scalarList : function(item, fieldName)
    {
        var list = [];

        $.each(item[fieldName], function(k, item){
            list.push(ag.ui.tool.fmt.out(item));
        });

        return list.join(", ");
    },

    date : function(item, fieldName)
    {
        var
            dateTimeObj = item[fieldName],
            date = new Date(Date.UTC(dateTimeObj.year, dateTimeObj.month - 1, dateTimeObj.day));

        return $("<span class='date'></span>").text(ag.ui.tool.date.format(date, ag.intl.t("d/m/Y")));
    },

    datetime : function(item, fieldName)
    {
        var
            dateTimeObj = item[fieldName],
            date = new Date(Date.UTC(dateTimeObj.year, dateTimeObj.month - 1, dateTimeObj.day, dateTimeObj.hour, dateTimeObj.minute));

        return $("<span class='datetime'></span>").text(ag.ui.tool.date.format(date, ag.intl.t("d/m/Y H:i")));
    },

    reference : function(item, fieldName)
    {
        return ag.ui.tool.fmt.out(item[fieldName].name);
    },

    user : function(item, fieldName)
    {
        return $("<a class='email'></a>").attr("href", "mailto:" + item[fieldName].email).text(item[fieldName].name);
    },

    location : function(item, fieldName)
    {
        return ag.ui.tool.fmt.sprintf("%s × %s", item.location.lat, item.location.lon);
    },

    status : function(item, fieldName)
    {
        var statusValues =
        {
            "-1" : "<span class='deleted'>" + ag.intl.t("deleted") + "</span>",
             "0" : "<span class='inactive'>" + ag.intl.t("inactive") + "</span>",
             "1" : "<span class='active'>" + ag.intl.t("active") + "</span>"
        };

        return statusValues[item[fieldName]];
    }
};

ag.admin.ObjectListTable._columns =
{
    id :            { title : ag.intl.t("ID"), filter: ag.admin.ObjectListTable._filters.id, style: "right" },
    num :           { title : "#", style: "right" },
    name :          { title : ag.intl.t("Name"), filter: ag.admin.ObjectListTable._filters.text },
    date :          { title : ag.intl.t("Date"), filter: ag.admin.ObjectListTable._filters.date },
    datetime :      { title : ag.intl.t("Date"), filter: ag.admin.ObjectListTable._filters.datetime },
    description :   { title : ag.intl.t("Description"), filter: ag.admin.ObjectListTable._filters.text },
    reference :     { title : "", filter: ag.admin.ObjectListTable._filters.reference },
    user :          { title : ag.intl.t("User"), filter: ag.admin.ObjectListTable._filters.user },
    location :      { title : ag.intl.t("Location"), filter: ag.admin.ObjectListTable._filters.location },
    status :        { title : ag.intl.t("Status"), filter : ag.admin.ObjectListTable._filters.status }
};

ag.admin.ObjectListTable._actions =
{
    edit : {
        title: ag.intl.t("edit"),
        icon : "fa fa-edit",
        createAction : function($link, item) {
            $link.attr("href", "#!/edit/" + item.id);
        }
    },

    duplicate : {
        title : ag.intl.t("duplicate"),
        icon : "fa fa-copy",
        createAction : function($link) {
            $link.click(function(){
                throw "Not implemented yet.";
            });
        }
    },

    remove : {
        title : ag.intl.t("delete"),
        icon : "fa fa-trash",
        createAction : function($link, item) {

            if (item.status === -1)
            {
                $link.addClass("invisible");
            }
            else
            {
                $link.click(function(){

                    var name = item.name ? ag.ui.tool.fmt.out(item.name) : item.id;

                    if (window.confirm(ag.ui.tool.fmt.sprintf(ag.intl.t("Are you sure you want to delete `%s`?"), name)))
                    {
                        ag.srv("api").doCall(
                            item.getName() + ".delete",
                            item.id,
                            function(res, status)
                            {
                                if (status === 200)
                                {
                                    $link.getTable().removeItem(item.id);

                                    ag.srv("messageHandler").showMessage(new ag.common.Message(
                                        ag.intl.t("The object was deleted successfully."),
                                        "success"
                                    ));
                                }
                            }
                        );
                    }
                });

            }
        }
    }
};
