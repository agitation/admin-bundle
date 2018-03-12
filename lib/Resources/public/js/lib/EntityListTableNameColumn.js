ag.admin.EntityListTable.registerColumn("name", {
    title : ag.intl.t("Name"),
    filter: (item, fieldName) => ag.u.out(item[fieldName]),
    priority : 1,
});
