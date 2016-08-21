ag.ns("ag.admin");

(function(){
var
    captionLabelIdCounter = 0,

    defaultFieldParams =
    {
        label : "",
        priority: 2,
        element : null
    },

    fieldFactory =
    {
        text : params => {
            return $.extend({}, defaultFieldParams, {
                label : ag.intl.t("Text"),
                element : new ag.ui.field.Text()
            }, params);
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
                element : new ag.ui.field.Boolean(ag.intl.t("include deleted items"))
            }, params);
        }
    },

    listSearch = function(fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-search"));
        this.fields = {};
        this.defaultValues = {};

        var
            captionsTrActions = this.find("tr.captions .actions"),
            fieldsTrActions = this.find("tr.fields .actions");

        Object.keys(fields).forEach(key => {
            var
                field = fields[key],
                captionLabelId = "ag-admin-objectlistsearch-" + captionLabelIdCounter++,
                classes = (key + " priority-" + field.priority),
                captionTd = ag.ui.tool.tpl("agitadmin-listview", "td.caption"),
                fieldTd = $("<td>");

            field.element.setTargetId(captionLabelId);
            this.fields[key] = field.element;

            captionTd
                .addClass(classes)
                .insertBefore(captionsTrActions)
                .find("label").text(field.label).attr("for", captionLabelId);

            fieldTd
                .html(field.element)
                .addClass(classes)
                .insertBefore(fieldsTrActions);

            this.defaultValues[key] = field.element.getValue();
        });

        this.find("td.actions a").click(() => this.trigger("reset"));
    };

    listSearch.prototype = Object.create(ag.ui.ctxt.Form.prototype);

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

    ag.admin.ObjectListSearch = listSearch;
})();
