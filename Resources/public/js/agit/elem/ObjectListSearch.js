agit.ns("agit.elem");

agit.elem.ObjectListSearch = function(endpointName, fields, isDefault)
{
    var
        apiService = agit.srv("api"),
        $elem = agit.tool.tpl(".listview-search"),
        $actions = $elem.find("td.actions"),
        $submit = $actions.find("button"),
        $reset =  $actions.find("a"),
        searchCallback = function(){},
        $fieldList = {},
        defaultValues = {},
        fieldIdCounter = 0,

        getValues = function()
        {
            var values = {};

            $.each($fieldList, function(name, $field){
                values[name] = $field.getValue();
            });

            return values;
        };

    $elem.addField = function(field)
    {
        var
            $td = $("<td class='field'>"),
            fieldId = "listsearch" + fieldIdCounter++;

        defaultValues[field.name] = field.element.getValue();

        field.element.attr("id", fieldId);
        $td.append($(agit.tool.fmt.sprintf("<label for='%s'>%s</label>", fieldId, field.label)));
        $td.append($fieldList[field.name] = field.element);

        $td.addClass(field.name).insertBefore($actions);
        $fieldList[field.name].is("[type=hidden]") && $td.addClass("hidden");
    };

    fields.forEach(function(field){
        $elem.addField(field);
    });

    $elem.setSearchCallback = function(callback)
    {
        searchCallback = function()
        {
            apiService.doCall(endpointName, getValues(), callback);
        };
    };

    $reset.click(function() {
        $.each($fieldList, function(name, $field){
            if ($field.reset)
                $field.reset();
            else
                $field.setValue(defaultValues[name]);
        });
    });

    $elem.submit(function(ev) {
        agit.common.Form.stopEvent(ev);
        searchCallback();
    });

    agit.srv("state").registerViewElement("/list/search", function(request){
        if (request instanceof Object)
            Object.keys(defaultValues).forEach(function(key){
               $fieldList[key].setValue(request[key] !== undefined ? request[key] : defaultValues[key]);
            });

        searchCallback();
    }, isDefault);

    return $elem;
};

agit.elem.ObjectListSearch._fields =
{
    name :
    {
        label : agit.intl.L10n.t("Name"),
        name : "name",
        element : new agit.field.Text($("<input type='text' class='form-control input-sm'>"))
    },

    status :
    {
        label : agit.intl.L10n.t("Status"),
        name : "statusList",
        element : new agit.field.Select({
            size: 3,
            multiple: "multiple",
            "data-type": "int",
            "class": "form-control input-sm"
        }, [
            { value: 1, text: agit.intl.L10n.t("active"), selected : true },
            { value: 0, text: agit.intl.L10n.t("inactive"), selected : true },
            { value: -1, text: agit.intl.L10n.t("deleted") }
        ])
    }
};

agit.elem.ObjectListSearch.getField = function(name)
{
    return agit.elem.ObjectListSearch._fields[name];
};
