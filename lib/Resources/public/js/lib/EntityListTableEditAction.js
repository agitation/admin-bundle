ag.admin.EntityListTable.registerAction("edit", {
    title: ag.intl.t("edit"),
    icon : "fa fa-edit",
    generate : (elem, item) => {
        item.deleted && elem.addClass("invisible");
        elem.attr("href", "#!/edit?" + item.id);
    }
});
