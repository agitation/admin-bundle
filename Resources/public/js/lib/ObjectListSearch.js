ag.ns("ag.admin");

(function(){
var
    fieldIdCounter = 0,

    availableFields =
    {
        text :
        {
            label : ag.intl.t("Text"),
            element : new ag.ui.field.Text(null, { "class" : "form-control input-sm" })
        },

        deleted :
        {
            label : "",
            element : new ag.ui.field.Boolean(ag.intl.t("include deleted items"))
        }
    },

    getValues = function()
    {
        var values = {};

        $.each(this.$fields, function(name, $field){
            values[name] = $field.getValue();
        });

        return values;
    },

    listSearch = function(endpointName, fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-search"));
        this.searchCallback = function(){};
        this.endpointName = endpointName;
        this.$fields = {};
        this.$actions = this.find("td.actions");
        this.defaultValues = {};

        var
            $reset = this.$actions.find("a");

        Object.keys(fields).forEach(key => {
            this.addField(key, fields[key]);
        });

        $reset.click(() => {
            $.each(this.$fields, (name, $field) => {
                if ($field.reset)
                    $field.reset();
                else
                    $field.setValue(this.defaultValues[name]);
            });
        });

        this.submit(ev => {
            this.stopEvent(ev);
            this.searchCallback();
        });
    };

    listSearch.prototype = Object.create(ag.ui.ctxt.Form.prototype);

    listSearch.prototype.addField = function(key, field)
    {
        var
            $td = $("<td class='field'>"),
            fieldId = "ag-admin-objectlistsearch-" + fieldIdCounter++;

        this.defaultValues[key] = field.element.getValue();

        field.element.attr("id", fieldId);
        $td.append($(ag.ui.tool.fmt.sprintf("<label class='caption' for='%s'>%s</label>", fieldId, field.label)));
        $td.append(this.$fields[key] = field.element);
        $td.addClass(key).insertBefore(this.$actions);
        this.$fields[key].is("[type=hidden]") && $td.addClass("hidden");
    };

    listSearch.prototype.setSearchCallback = function(callback)
    {
        this.searchCallback = function()
        {
            ag.srv("api").doCall(this.endpointName, getValues.call(this), callback);
        };
    };

    listSearch.prototype.getAction = function()
    {
        return (request) => {
            if (request instanceof Object)
                Object.keys(this.defaultValues).forEach(function(key){
                   this.$fields[key].setValue(request[key] !== undefined ? request[key] : this.defaultValues[key]);
                });

            this.searchCallback();
        }
    };

    listSearch.getField = function(name)
    {
        return availableFields[name];
    };

    ag.admin.ObjectListSearch = listSearch;
})();
