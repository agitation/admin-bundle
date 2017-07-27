ag.admin.EntityListTable.registerColumn("reference", {
     filter : (item, fieldName, params) => {
         var nameField = params && params.field ? params.field : "name";
         return item[fieldName] && item[fieldName][nameField] ? ag.ui.tool.fmt.out(item[fieldName][nameField]) : "–";
     },
     priority : 2
});
