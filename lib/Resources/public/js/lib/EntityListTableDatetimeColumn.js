ag.admin.EntityListTable.registerColumn("datetime", {
     title : ag.intl.t("Date"),
     filter: (item, fieldName) =>
     {
         var dateTimeObj = item[fieldName],
             date = new Date(Date.UTC(dateTimeObj.year, dateTimeObj.month - 1, dateTimeObj.day, dateTimeObj.hour, dateTimeObj.minute));

         return $("<span class='datetime'></span>").text(ag.u.date.format(date, ag.intl.x("date format", "Y-m-d H:i")));
     }
});
