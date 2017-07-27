var removeCall = function(elem, item)
{
    ag.srv("api").doCall(
        item.getName() + ".remove",
        item.id,
        (res, status) => {
            if (status === 200)
            {
                elem.getTable().removeItem(item.id);
                ag.srv("messageHandler").alert(ag.intl.t("The object was deleted successfully."), "success");
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
                ag.ui.tool.fmt.sprintf("`%s` (ID: `%s`)", ag.ui.tool.fmt.out(item.name), item.id) :
                "`" + item.id + "`";

            ag.srv("messageHandler").confirm(
                ag.ui.tool.fmt.sprintf(ag.intl.t("Are you sure you want to permanently delete object %s?"), name),
                () => { removeCall(elem, item); }
            );
        });
    }

});
