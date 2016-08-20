ag.ns("ag.admin");

(function(){
var
    fieldIdCounter = 0,

    defaultFieldParams = { label : "", priority: 2, element : null };

    fieldFactory =
    {
        text : params => {
            return $.extend({
                label : ag.intl.t("Text"),
                element : new ag.ui.field.Text(),
                priority : 2
            }, params);
        },

        date : params => {
            return $.extend({
                label : ag.intl.t("Date"),
                element : new ag.ui.field.Datepicker(),
                priority : 2
            }, params);
        },

        period : params => {
            return $.extend({
                label : ag.intl.t("Period"),
                element : new ag.admin.field.Period(params.minRange, params.maxRange),
                priority : 2
            }, params);
        },

        deleted : params => {
            return $.extend({
                label : "",
                element : new ag.ui.field.Boolean(ag.intl.t("include deleted items")),
                priority : 1
            }, params);
        }
    },

    listSearch = function(fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".listview-search"));
        this.fields = {};
        this.actions = this.find("td.actions");
        this.defaultValues = {};

        Object.keys(fields).forEach(key => {
            this.addField(key, fields[key]);
        });

        this.actions.find("a").click(() => {
            Object.keys(this.fields).forEach(name => this.fields[name].setValue(this.defaultValues[name]));
        });
    };

    listSearch.prototype = Object.create(ag.ui.ctxt.Form.prototype);

    listSearch.prototype.addField = function(key, field)
    {
        var
            $td = $("<td class='field'>"),
            fieldId = "ag-admin-objectlistsearch-" + fieldIdCounter++;

        this.fields[key] = field.element;
        this.defaultValues[key] = field.element.getValue();
        field.element.setTargetId(fieldId);
        $td.append($(ag.ui.tool.fmt.sprintf("<label class='caption' for='%s'>%s</label>", fieldId, field.label)));
        $td.append(field.element);
        $td.addClass(key + " priority-" + field.priority).insertBefore(this.actions);
        this.fields[key].is("[type=hidden]") && $td.addClass("hidden");
    };

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
