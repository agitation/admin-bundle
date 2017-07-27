ag.admin.EntityListTable.registerColumn("id", {
     title : ag.intl.t("ID"),
     filter: (item, fieldName) => $("<span class='id'></span>").text(item[fieldName]),
     style: "right",
     priority : 1
});
