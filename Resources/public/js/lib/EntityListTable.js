ag.ns("ag.admin");

(function(){

var
    deleteUndeleteCall = function(type, $link, item)
    {
        ag.srv("api").doCall(
            item.getName() + "." + type,
            item.id,
            (res, status) => {
                if (status === 200)
                {
                    item.deleted = (type === "delete");
                    $link.getTable().updateItem(item);

                    ag.srv("messageHandler").alert(
                        type === "delete"
                            ? ag.intl.t("The object was deleted successfully.")
                            : ag.intl.t("The object was restored successfully."),
                        "success"
                    );
                }
            }
        );
    },

    removeCall = function($link, item)
    {
        ag.srv("api").doCall(
            item.getName() + ".remove",
            item.id,
            (res, status) => {
                if (status === 200)
                {
                    $link.getTable().removeItem(item.id);
                    ag.srv("messageHandler").alert(ag.intl.t("The object was removed successfully."), "success");
                }
            }
        );
    },

    createClone = function(origEntity)
    {
        var entity = new ag.api.Object(origEntity.getName());

        Object.keys(entity).forEach(prop => {
            var propMeta = entity.getPropMeta(prop);

            if (prop === "id")
                entity[prop] = null;

            else if (propMeta.readonly)
                entity[prop] = null;

            else if (propMeta.type === "objectlist")
                entity[prop] = origEntity[prop].map(child => createClone(child));

            else if (propMeta.type === "object")
                entity[prop] = createClone(origEntity[prop]);

            else if (propMeta.type === "entitylist")
                entity[prop] = origEntity[prop].map(child => child.id);

            else if (propMeta.type === "entity")
                entity[prop] = origEntity[prop].id;

            else
                entity[prop] = origEntity[prop];
        });

        return entity;
    },

    duplicate = function($link, item, changedFields)
    {
        var clonedItem = createClone(item);

        $.extend(clonedItem, changedFields || {});

        ag.srv("api").doCall(
            item.getName() + ".create",
            clonedItem,
            function(result, status)
            {
                if (status === 200)
                {
                    $link.getTable().addItem(result);

                    ag.srv("messageHandler").alert(
                        ag.ui.tool.fmt.sprintf(ag.intl.t("The object has been successfully cloned, the new object’s ID is `%s`."), result.id),
                        "success"
                    );
                }
            }
        );
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

entityListTable = function(exporter, columns, actions)
{
    // TODO: nodify();
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

entityListTable.getFilter = function(name)
{
    return entityListTable._filters[name];
};

entityListTable.getColumn = function(name, extra)
{
    return $.extend(
        {},
        entityListTable._columnTpl,
        entityListTable._columns[name],
        extra || {}
    );
};

entityListTable.createColumn = function(options)
{
    return $.extend(
        {},
        entityListTable._columnTpl,
        options);
};

entityListTable.getAction = function(name, extra)
{
    return $.extend(
        {},
        entityListTable._actionTpl,
        entityListTable._actions[name],
        extra || {}
    );
};

entityListTable.createAction = function(params)
{
    return $.extend({}, entityListTable._actionTpl, params);
};

entityListTable._filters =
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

        return $("<span class='datetime'></span>").text(ag.ui.tool.date.format(date, ag.intl.t("d/m H:i")));
    },

    reference : function(item, fieldName, params)
    {
        var nameField = params && params.field ? params.field : "name";
        return ag.ui.tool.fmt.out(item[fieldName][nameField]);
    },

    check : function(item, fieldName)
    {
        return item[fieldName] ? $("<i class='check fa fa-check'>") : "";
    }
};

entityListTable._columnTpl = { title : "", filter : () => {}, style : "", priority : 2 };

entityListTable._columns =
{
    id :            { title : ag.intl.t("ID"), filter: entityListTable._filters.id, style: "right", priority : 1 },
    num :           { title : "#", style: "right", priority : 1 },
    name :          { title : ag.intl.t("Name"), filter: entityListTable._filters.text, priority : 1 },
    date :          { title : ag.intl.t("Date"), filter: entityListTable._filters.date },
    datetime :      { title : ag.intl.t("Date"), filter: entityListTable._filters.datetime },
    description :   { title : ag.intl.t("Description"), filter: entityListTable._filters.text, style: "longtext", priority : 3 },
    reference :     { title : "", filter: entityListTable._filters.reference, priority : 2 },
    check :         { title : "", style: "center", filter: entityListTable._filters.check, priority : 2 },
    user :          { title : ag.intl.t("User"), filter: entityListTable._filters.user, priority : 2 }
};

entityListTable._actionTpl = { title : "", href : "", generate : () => {}, icon : "", params : {} };

entityListTable._actions =
{
    edit : {
        title: ag.intl.t("edit"),
        icon : "fa fa-edit",
        generate : ($link, item) => {
            item.deleted && $link.addClass("invisible");
            $link.attr("href", "#!/edit?" + item.id);
        }
    },

    duplicate : {
        title : ag.intl.t("duplicate"),
        icon : "fa fa-copy",
        generate : ($link, item, params) => {
            var fields = params.fields || {};

            item.deleted && $link.addClass("invisible");

            $link.click(ev => {
                var
                    hasFields = Object.keys(fields).length,
                    name = item.name ? ag.ui.tool.fmt.out(item.name) : item.id,
                    modal;

                if (!hasFields)
                {
                    modal = new ag.ui.elem.ConfirmModal(
                        ag.ui.tool.fmt.sprintf(ag.intl.t("Are you sure you want to duplicate `%s`?"), name),
                        function(){ duplicate($link, item); }
                    );
                }
                else
                {
                    Object.keys(fields).forEach(key => {
                        fields[key].element.setValue(item[key]);
                    });

                    modal = new ag.admin.CloneModal(fields, function(){ duplicate($link, item, modal.getValues()); });
                }

                modal.appear();
            });
        }
    },

    delete : {
        title : ag.intl.t("delete"),
        icon : "fa fa-trash",
        generate : function($link, item) {
            var actionType = "delete";

            if (item.deleted)
            {
                $link
                    .find("i").attr("class", "fa fa-trash-o").end()
                    .find("span").text(ag.intl.t("restore"));

                actionType = "undelete";
            }

            $link.click(() => deleteUndeleteCall(actionType, $link, item));
        }
    },

    remove : {
        title : ag.intl.t("remove"),
        icon : "fa fa-times-circle",
        generate : function($link, item) {
            item.deleted === false && $link.addClass("invisible");
            item.deleted !== undefined && $link.find("span").text(ag.intl.t("remove permanently"));

            $link.click(() => {
                var name = item.name
                    ? ag.ui.tool.fmt.sprintf("`%s` (ID: `%s`)", ag.ui.tool.fmt.out(item.name), item.id)
                    : "`" + item.id + "`";

                if (window.confirm(ag.ui.tool.fmt.sprintf(ag.intl.t("Are you sure you want to permanently remove object %s?"), name)))
                    removeCall($link, item);
            });
        }
    }
};

ag.admin.EntityListTable = entityListTable;

})();
