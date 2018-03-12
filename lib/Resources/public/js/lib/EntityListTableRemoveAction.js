var removeCall = function(elem, item)
{
    ag.s.api.doCall(
        item.getName() + ".remove",
        item.id,
        (res, status) => {
            if (status === 200)
            {
                elem.getTable().removeItem(item.id);
                ag.s.msg.alert(ag.intl.t("The object was deleted successfully."), "success");
            }
        }
    );
};

ag.admin.EntityListTable.registerAction("remove", {
    title : ag.intl.t("delete"),
    icon : "fa fa-times-circle",
    generate : function(elem, item) {
        item.deleted === false && elem.addClass("invisible");
        item.deleted !== undefined && elem.find("span").text(ag.intl.t("delete permanently"));

        elem.click(() => {
            var name = item.name ?
                ag.u.sprintf("`%s` (ID: `%s`)", ag.u.out(item.name), item.id) :
                "`" + item.id + "`";

            ag.s.msg.confirm(
                ag.u.sprintf(ag.intl.t("Are you sure you want to permanently delete object %s?"), name),
                () => { removeCall(elem, item); }
            );
        });
    }

});
