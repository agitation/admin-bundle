ag.admin.EntityListTable.registerColumn("check", {
    style: "center",
    filter: (item, fieldName) => item[fieldName] ? $("<i class='check fa fa-check'>") : ""
});
