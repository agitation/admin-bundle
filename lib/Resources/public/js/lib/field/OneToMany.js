ag.ns("ag.admin.field");

(function(){
    var
        oneToManyField = function()
        {
            this.nodify();

            this.rows = [];
            this.footer = this.createFooter();

            this.append([this.createHeader(), this.footer]);

            this.on("ag.admin.onetomany.add", (ev, obj) => {
                var row = this.createRow();
                row.setValue(obj);
                this.addRow(row);
                this.removeClass("empty");
            });

            this.on("ag.admin.onetomany.remove", (ev, obj) => {
                this.footer.triggerHandler("ag.admin.onetomany.remove", obj);
                this.toggleClass("empty", !this.rows.length);

            });
        };

    oneToManyField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    oneToManyField.prototype.nodify = function()
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-forms", ".onetomany"));
    };

    oneToManyField.prototype.createHeader = function() { };

    oneToManyField.prototype.createFooter = function() { };

    oneToManyField.prototype.createRow = function() { };

    oneToManyField.prototype.addRow = function(row)
    {
        this.rows.push(row);
        this.removeClass("empty").append(row);

        row.on("ag.admin.onetomany.remove", () => {
            this.rows.splice(this.rows.indexOf(row), 1);
            this.rows.length || this.addClass("empty");
        });
    };

    oneToManyField.prototype.setValue = function(value)
    {
        this.rows = [];
        this.find("tbody").remove();
        this.footer.reset();
        value.forEach(obj => this.footer.trigger("ag.admin.onetomany.add", obj));
        this.toggleClass("empty", !value.length);

        return this.triggerHandler("ag.field.set");
    };

    oneToManyField.prototype.getValue = function()
    {
        return this.rows.map(row => row.getValue());
    };

    ag.admin.field.OneToMany = oneToManyField;
})();
