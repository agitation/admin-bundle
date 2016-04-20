agit.ns("agit.elem");

agit.elem.ObjectListTable = function(exporter, columns, actions)
{
    var
        $elem = agit.tool.tpl(".listview-table"),
        $table = $elem.find("table"),
        $tbody = $table.find("tbody"),
        $header = $table.find("thead tr"),
        $tfoot = $table.find("tfoot"),
        $footer = $tfoot.find("tr"),

        entities = new agit.common.Collection(),
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
        var $row = agit.tool.tpl(".listview-table tr.noresults");

        $row.find("td").attr("colspan", Object.keys(columns).length + (actions.length ? 1 : 0));

        $tbody.html($row);
        updateFooter(true);
    };

    Object.keys(columns).forEach(function(key) {
        $header.append($("<th>").addClass(columns[key].style).text(columns[key].title));
    });

    actions.length && $header.append($("<th class='actions'>").text(agit.intl.t("Actions")));
    $elem.showNoResultsRow();

    return $elem;
};

agit.elem.ObjectListTable.getFilter = function(name)
{
    return agit.elem.ObjectListTable._filters[name];
};

agit.elem.ObjectListTable.getColumn = function(name, extra)
{
    return $.extend(
        {},
        agit.elem.ObjectListTable._columnTpl,
        agit.elem.ObjectListTable._columns[name],
        extra || {});
};

agit.elem.ObjectListTable.createColumn = function(options)
{
    return $.extend(
        {},
        agit.elem.ObjectListTable._columnTpl,
        options);
};

agit.elem.ObjectListTable.getAction = function(name, extra)
{
    return $.extend(
        {},
        agit.elem.ObjectListTable._actionTpl,
        agit.elem.ObjectListTable._actions[name],
        extra || {});
};

agit.elem.ObjectListTable._columnTpl = { name : null, filter : function(){}, style : "" };
agit.elem.ObjectListTable._actionTpl = { title : "", href : "", createAction : function(){}, icon : "" };

agit.elem.ObjectListTable._filters =
{
    id : function(item)
    {
        return $("<span class='id'></span>").text(item.id);
    },

    text : function(item, fieldName)
    {
        return agit.tool.fmt.out(item[fieldName]);
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
        return item[fieldName] ? agit.tool.fmt.out(item[fieldName].name) : "–";
    },

    scalarList : function(item, fieldName)
    {
        var list = [];

        $.each(item[fieldName], function(k, item){
            list.push(agit.tool.fmt.out(item));
        });

        return list.join(", ");
    },

    datetime : function(item, fieldName)
    {
        return $("<span class='datetime'></span>").text(agit.intl.formatDay(item[fieldName]));
    },

    reference : function(item, fieldName)
    {
        return agit.tool.fmt.out(item[fieldName].name);
    },

    email : function(item, fieldName)
    {
        return $("<a class='email'></a>").attr("href", item[fieldName]).text(item[fieldName]);
    },

    status : function(item, fieldName)
    {
        var statusValues =
        {
            "-1" : "<span class='deleted'>" + agit.intl.t("deleted") + "</span>",
             "0" : "<span class='inactive'>" + agit.intl.t("inactive") + "</span>",
             "1" : "<span class='active'>" + agit.intl.t("active") + "</span>"
        };

        return statusValues[item[fieldName]];
    }
};

agit.elem.ObjectListTable._columns =
{
    id :            { title : agit.intl.t("ID"), filter: agit.elem.ObjectListTable._filters.id, style: "right" },
    num :           { title : "#", style: "right" },
    name :          { title : agit.intl.t("Name"), filter: agit.elem.ObjectListTable._filters.text },
    description :   { title : agit.intl.t("Description"), filter: agit.elem.ObjectListTable._filters.text },
    reference :     { title : "", filter: agit.elem.ObjectListTable._filters.reference },
    email :         { title : agit.intl.t("E-mail"), filter: agit.elem.ObjectListTable._filters.email },
    status :        { title : agit.intl.t("Status"), filter : agit.elem.ObjectListTable._filters.status }
};

agit.elem.ObjectListTable._actions =
{
    edit : {
        title: agit.intl.t("edit"),
        icon : "fa fa-edit",
        createAction : function($link, item) {
            $link.attr("href", "#!/edit/form/" + item.id);
        }
    },

    duplicate : {
        title : agit.intl.t("duplicate"),
        icon : "fa fa-copy",
        createAction : function($link) {
            $link.click(function(){
                throw "Not implemented yet.";
            });
        }
    },

    remove : {
        title : agit.intl.t("delete"),
        icon : "fa fa-trash",
        createAction : function($link, item) {

            if (item.status === -1)
            {
                $link.addClass("invisible");
            }
            else
            {
                $link.click(function(){

                    var name = item.name ? agit.tool.fmt.out(item.name) : item.id;

                    if (window.confirm(agit.tool.fmt.sprintf(agit.intl.t("Are you sure you want to delete `%s`?"), name)))
                    {
                        agit.srv("api").doCall(
                            item.getName() + ".delete",
                            item.id,
                            function(res, status)
                            {
                                if (status === 200)
                                {
                                    $link.getTable().removeItem(item.id);

                                    agit.srv("messageHandler").showMessage(new agit.common.Message(
                                        agit.intl.t("The object was deleted successfully."),
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
