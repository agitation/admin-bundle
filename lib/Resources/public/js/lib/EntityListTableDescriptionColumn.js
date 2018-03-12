ag.admin.EntityListTable.registerColumn("description", {
    title : ag.intl.t("Description"),
    style: "longtext",
    priority : 3,
    filter: (item, fieldName) => ag.u.out(item[fieldName])
});
