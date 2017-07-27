ag.admin.EntityListTable.registerColumn("date", {
     title : ag.intl.t("Date"),
     filter: (item, fieldName) =>
     {
         var dateTimeObj = item[fieldName],
             date = new Date(Date.UTC(dateTimeObj.year, dateTimeObj.month - 1, dateTimeObj.day));

         return $("<span class='date'></span>").text(ag.ui.tool.date.format(date, ag.intl.x("date format", "Y-m-d")));
     }
});
