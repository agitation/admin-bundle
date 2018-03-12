(function(){

var EntityListTableDuplicateAction =
{
    title : ag.intl.t("duplicate"),
    icon : "fa fa-copy",
    generate : (elem, item, params) => {
        var fields = params.fields || {};

        item.deleted && elem.addClass("invisible");

        elem.click(() => {
            var
                hasFields = Object.keys(fields).length,
                name = item.name ? ag.u.out(item.name) : item.id,
                modal;

            if (!hasFields)
            {
                modal = new ag.ui.modal.Confirm(
                    ag.u.sprintf(ag.intl.t("Are you sure you want to duplicate `%s`?"), name),
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
        object : value => EntityListTableDuplicateAction.createClone(value),
        objectlist : value => value.map(child => EntityListTableDuplicateAction.createClone(child)),
        entity : value => value ? value.id : null,
        entitylist : value => value.map(child => child.id)
    }
},

duplicate = function(elem, item, changedFields, reload)
{
    // sometimes we cannot take the item from the search results because it is incomplete or contains additional data

    if (reload)
        ag.s.api.doCall(
            item.getName() + ".get",
            item.id,
            realItem => duplicateCall.call(this, elem, realItem, changedFields)
        );
    else
        duplicateCall.call(this, elem, item, changedFields);
},

duplicateCall = function(elem, item, changedFields)
{
    var clonedItem = EntityListTableDuplicateAction.createClone(item);

    $.extend(clonedItem, changedFields || {});

    ag.s.api.doCall(
        item.getName() + ".create",
        clonedItem,
        (result, status) => {
            if (status === 200)
            {
                elem.trigger("ag.admin.entity.create", result); // this does currently not add the element to the table
                elem.getTable().addItem(result);

                ag.s.msg.alert(
                    ag.u.sprintf(ag.intl.t("The object has been successfully cloned, the new object’s ID is `%s`."), result.id),
                    "success"
                );
            }
        }
    );
};

EntityListTableDuplicateAction.createClone = function(origObject)
{
    var object = new ag.api.Object(origObject.getName());

    Object.keys(object).forEach(prop => {
        var propMeta = object.getPropMeta(prop);

        if (prop === "id" || propMeta.readonly)
            object[prop] = null;

        else if (EntityListTableDuplicateAction.cloneFunc[propMeta.type])
            object[prop] = EntityListTableDuplicateAction.cloneFunc[propMeta.type](origObject[prop]);

        else
            object[prop] = origObject[prop];
    });

    return object;
};

// expose publically so that 3rd-party cloners can be added
ag.admin.EntityListTableDuplicateAction = EntityListTableDuplicateAction;
ag.admin.EntityListTable.registerAction("duplicate", EntityListTableDuplicateAction);

})();
