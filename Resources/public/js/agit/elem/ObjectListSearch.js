agit.ns("agit.elem");

(function(){
var
    fieldIdCounter = 0,

    availableFields =
    {
        text :
        {
            label : agit.intl.t("Text"),
            element : new agit.field.Text($("<input type='text' class='form-control input-sm'>"))
        },

        status :
        {
            label : agit.intl.t("Status"),
            element : new agit.field.Select({
                size: 3,
                multiple: "multiple",
                "data-type": "int",
                "class": "form-control input-sm"
            }, [
                { value: 1, text: agit.intl.t("active"), selected : true },
                { value: 0, text: agit.intl.t("inactive"), selected : true },
                { value: -1, text: agit.intl.t("deleted") }
            ])
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

    listSearch = function(endpointName, fields, isDefault)
    {
        this.extend(this, agit.tool.tpl("agitadmin-listview", ".listview-search"));
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
            agit.common.Form.stopEvent(ev);
            this.searchCallback();
        });

        agit.srv("state").registerViewElement("/list/search", request => {
            if (request instanceof Object)
                Object.keys(this.defaultValues).forEach(function(key){
                   this.$fields[key].setValue(request[key] !== undefined ? request[key] : this.defaultValues[key]);
                });

            this.searchCallback();
        }, isDefault);
    };

    listSearch.prototype = Object.create(jQuery.prototype);

    listSearch.prototype.addField = function(key, field)
    {
        var
            $td = $("<td class='field'>"),
            fieldId = "listsearch" + fieldIdCounter++;

        this.defaultValues[key] = field.element.getValue();

        field.element.attr("id", fieldId);
        $td.append($(agit.tool.fmt.sprintf("<label for='%s'>%s</label>", fieldId, field.label)));
        $td.append(this.$fields[key] = field.element);
        $td.addClass(key).insertBefore(this.$actions);
        this.$fields[key].is("[type=hidden]") && $td.addClass("hidden");
    };

    listSearch.prototype.setSearchCallback = function(callback)
    {
        this.searchCallback = function()
        {
            agit.srv("api").doCall(this.endpointName, getValues.call(this), callback);
        };
    };

    listSearch.getField = function(name)
    {
        return availableFields[name];
    };

    agit.elem.ObjectListSearch = listSearch;
})();
