ag.ns("ag.admin");

(function(){
var
    labelIdCounter = 0,

    defaultFieldParams =
    {
        label : "",
        style : "",
        priority: 2,
        element : null
    },

    fieldFactory =
    {
        text : params => {
            var field = $.extend({}, defaultFieldParams, {
                label : ag.intl.t("Name"),
                priority: 1,
                element : new ag.ui.field.Text(null)
            }, params);

            field.element.attr({ placeholder : field.label });

            return field;
        },

        date : params => {
            return $.extend({}, defaultFieldParams, {
                label : ag.intl.t("Date"),
                element : new ag.ui.field.Datepicker()
            }, params);
        },

        period : params => {
            return $.extend({}, defaultFieldParams, {
                label : ag.intl.t("Period"),
                element : new ag.admin.field.Period(params.minRange, params.maxRange)
            }, params);
        },

        deleted : params => {
            return $.extend({}, defaultFieldParams, {
                label : "",
                element : new ag.ui.field.Boolean(ag.intl.t("show inactive"))
            }, params);
        }
    },

    listSearch = function(fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-search"));
        this.fields = {};
        this.defaultValues = {};

        var
            labelsTrActions = this.find("tr.labels .actions"),
            fieldsTrActions = this.find("tr.fields .actions");

        Object.keys(fields).forEach(key => {
            var
                field = fields[key],
                elem = field.element,
                labelId = elem.getTargetId() || "ag-admin-listsearch-" + labelIdCounter++,
                classes = field.style + " " + key + " priority-" + field.priority,
                captionTd = ag.ui.tool.tpl("agitadmin-listview", "td.caption"),
                fieldTd = $("<td>");

            elem.setTargetId(labelId);
            this.fields[key] = elem;

            captionTd
                .addClass(classes)
                .insertBefore(labelsTrActions)
                .find("label").text(field.label).attr("for", labelId);

            fieldTd
                .html(elem)
                .addClass(classes)
                .insertBefore(fieldsTrActions);

            this.defaultValues[key] = elem.getValue();
        });
    };

    listSearch.prototype = Object.create(ag.app.Header.prototype);

    listSearch.prototype.setValues = function(values)
    {
        Object.keys(this.defaultValues)
            .forEach(key => this.fields[key].setValue(values[key] !== undefined ? values[key] : this.defaultValues[key]));

        return this;
    };

    listSearch.prototype.getValues = function()
    {
        var values = {};

        Object.keys(this.fields).forEach(name => (values[name] = this.fields[name].getValue()));

        return values;
    };

    listSearch.createField = function(params)
    {
        return $.extend({}, defaultFieldParams, params);
    };

    listSearch.getField = function(name, params)
    {
        params = params || {};
        return $.extend({}, defaultFieldParams, fieldFactory[name](params), params);
    };

    ag.admin.EntityListSearch = listSearch;
})();
