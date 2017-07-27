ag.admin.EntityListTable.registerColumn("name", {
    title : ag.intl.t("Name"),
    filter: (item, fieldName) => ag.ui.tool.fmt.out(item[fieldName]),
    priority : 1,
});
