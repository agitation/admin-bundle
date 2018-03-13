var deleteUndeleteCall = function(type, $link, item)
{
    var isDelete = type === "delete";

    ag.s.api.doCall(
        item.getName() + "." + type,
        item.id,
        (res, status) => {
            if (status === 200)
            {
                item.deleted = isDelete;
                $link.getTable().updateItem(item);

                ag.s.msg.alert(
                    isDelete ? ag.intl.t("The object was deactivated successfully.") : ag.intl.t("The object was activated successfully."),
                    "success"
                );
            }
        },
        ag.s.ind
    );
};

ag.admin.EntityListTable.registerAction("delete", {
    title : ag.intl.t("deactivate"),
    icon : "fa fa-trash",
    generate : function($link, item) {
        var actionType = "delete";

        if (item.deleted)
        {
            $link
                .find("i").attr("class", "fa fa-trash-o").end()
                .find("span").text(ag.intl.t("activate"));

            actionType = "undelete";
        }

        $link.click(() => deleteUndeleteCall(actionType, $link, item));
    }
});
