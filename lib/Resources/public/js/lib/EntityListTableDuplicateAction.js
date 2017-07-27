var duplicateAction =
{
    title : ag.intl.t("duplicate"),
    icon : "fa fa-copy",
    generate : (elem, item, params) => {
        var fields = params.fields || {};

        item.deleted && elem.addClass("invisible");

        elem.click(() => {
            var
                hasFields = Object.keys(fields).length,
                name = item.name ? ag.ui.tool.fmt.out(item.name) : item.id,
                modal;

            if (!hasFields)
            {
                modal = new ag.ui.modal.Confirm(
                    ag.ui.tool.fmt.sprintf(ag.intl.t("Are you sure you want to duplicate `%s`?"), name),
                    duplicate.bind(this, elem, item, null, params.reload)
                );
            }
            else
            {
                Object.keys(fields).forEach(key => {
                    fields[key].element.setValue(item[key]);
                });

                modal = new ag.admin.CloneModal(fields, () => duplicate(elem, item, modal.getValues(), params.reload));
            }

            modal.appear();
        });
    },

    // feel free to extend this with additional clone filters
    cloneFunc :
    {
        object : value => duplicateAction.createClone(value),
        objectlist : value => value.map(child => duplicateAction.createClone(child)),
        entity : value => value ? value.id : null,
        entitylist : value => value.map(child => child.id)
    }
},

duplicate = function(elem, item, changedFields, reload)
{
    // sometimes we cannot take the item from the search results because it is incomplete or contains additional data

    if (reload)
        ag.srv("api").doCall(
            item.getName() + ".get",
            item.id,
            realItem => duplicateCall.call(this, elem, realItem, changedFields)
        );
    else
        duplicateCall.call(this, elem, item, changedFields);
},

duplicateCall = function(elem, item, changedFields)
{
    var clonedItem = duplicateAction.createClone(item);

    $.extend(clonedItem, changedFields || {});

    ag.srv("api").doCall(
        item.getName() + ".create",
        clonedItem,
        (result, status) => {
            if (status === 200)
            {
                elem.getTable().addItem(result);

                ag.srv("messageHandler").alert(
                    ag.ui.tool.fmt.sprintf(ag.intl.t("The object has been successfully cloned, the new object’s ID is `%s`."), result.id),
                    "success"
                );
            }
        }
    );
};

duplicateAction.createClone = function(origObject)
{
    var object = new ag.api.Object(origObject.getName());

    Object.keys(object).forEach(prop => {
        var propMeta = object.getPropMeta(prop);

        if (prop === "id")
            object[prop] = null;

        else if (propMeta.readonly)
            object[prop] = null;

        else if (duplicateAction.cloneFunc[propMeta.type])
            object[prop] = duplicateAction.cloneFunc[propMeta.type](origObject[prop]);

        else
            object[prop] = origObject[prop];
    });

    return object;
};

// expose publically so that 3rd-party cloners can be added
ag.admin.EntityListTableDuplicateAction = duplicateAction;
ag.admin.EntityListTable.registerAction("duplicate", duplicateAction);
