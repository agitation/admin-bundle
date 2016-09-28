ag.ns("ag.admin.field");

(function(){
    var
        keyValueTable = function()
        {
            this.nodify();
            this.tbody = this.find("tbody");

            this.find("tfoot a").click(() => this.toggleClass("full"));
        };

    keyValueTable.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    keyValueTable.prototype.nodify = function()
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-forms", "table.key-value"));
    };

    keyValueTable.prototype.setValue = function(keyValueMap)
    {
        var rowNum = 0;

        this.removeClass("full long");
        this.tbody.empty();

        Object.keys(keyValueMap).forEach(key => {
            var row = ag.ui.tool.tpl("agitadmin-forms", ".key-value-row");

            ++rowNum > 5 && row.addClass("extra");

            row.find("th").text(ag.ui.tool.fmt.out(key));
            row.find("td").text(ag.ui.tool.fmt.out(keyValueMap[key]));

            this.tbody.append(row);
        });

        if (rowNum > 5)
            this.addClass("long");

        this.triggerHandler("ag.field.set");
        return this;
    };

    ag.admin.field.KeyValueTable = keyValueTable;
})();
