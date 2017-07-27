var createClone = function(origEntity)
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
            entity[prop] = origEntity[prop] ? origEntity[prop].id : null;

        else
            entity[prop] = origEntity[prop];
    });

    return entity;
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
    var clonedItem = createClone(item);

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

ag.admin.EntityListTable.registerAction("duplicate", {
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
    }
});
