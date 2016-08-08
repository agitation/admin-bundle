ag.ns("ag.admin");

(function(){
var
    fieldIdCounter = 0,

    fieldFactory =
    {
        text : params => {
            return $.extend({
                label : ag.intl.t("Text"),
                element : new ag.ui.field.Text()
            }, params);
        },

        date : params => {
            return $.extend({
                label : ag.intl.t("Date"),
                element : new ag.ui.field.Datepicker()
            }, params);
        },

        deleted : params => {
            return $.extend({
                label : "",
                element : new ag.ui.field.Boolean(ag.intl.t("include deleted items"))
            }, params);
        }
    },

    valuesAreEqual = function(v1, v2)
    {
        var same = true;

        if (typeof(v1) !== typeof(v2))
        {
            same = false;
        }
        else if (typeof(v1) === "object")
        {
            if (Object.keys(v1).length !== Object.keys(v2).length)
                same = false;
            else
                Object.keys(v1).every(key => {
                    return same = valuesAreEqual(v1[key], v2[key]);
                });
        }
        else
        {
            same = (v1 === v2);
        }

        return same;
    },

    listSearch = function(endpointName, fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-search"));
        this.endpointName = endpointName;
        this.fields = {};
        this.actions = this.find("td.actions");
        this.defaultValues = {};

        var
            $reset = this.actions.find("a");

        Object.keys(fields).forEach(key => {
            this.addField(key, fields[key]);
        });

        $reset.click(() => {
            $.each(this.fields, (name, $field) => {
                if ($field.reset)
                    $field.reset();
                else
                    $field.setValue(this.defaultValues[name]);
            });
        });

        this.submit(ev => {
            this.stopEvent(ev);
            this.search();
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
        $td.append(this.fields[key] = field.element);
        $td.addClass(key).insertBefore(this.actions);
        this.fields[key].is("[type=hidden]") && $td.addClass("hidden");
    };

    listSearch.prototype.search = function()
    {
        var values = {};

        $.each(this.fields, (name, field) => {
            values[name] = field.getValue();
        });

        ag.srv("state").update(null, valuesAreEqual(this.defaultValues, values) ? "" : values);

        ag.srv("api").doCall(
            this.endpointName,
            values,
            result => {
                this.trigger("ag.admin.objectsearch.update", [result]);
            }
        );
    };

    listSearch.prototype.getAction = function()
    {
        return (request) => {
            if (request instanceof Object)
                Object.keys(this.defaultValues).forEach(key => {
                   this.fields[key].setValue(request[key] !== undefined ? request[key] : this.defaultValues[key]);
                });

            this.search();
        }
    };

    listSearch.getField = function(name, params)
    {
        return fieldFactory[name](params || {});
    };

    ag.admin.ObjectListSearch = listSearch;
})();
