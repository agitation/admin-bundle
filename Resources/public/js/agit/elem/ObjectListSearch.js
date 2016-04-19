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
        $fields = {},
        defaultValues = {},
        fieldIdCounter = 0,

        getValues = function()
        {
            var values = {};

            $.each($fields, function(name, $field){
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
        $td.append($fields[field.name] = field.element);

        $td.addClass(field.name).insertBefore($actions);
        $fields[field.name].is("[type=hidden]") && $td.addClass("hidden");
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
        $.each($fields, function(name, $field){
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
               $fields[key].setValue(request[key] !== undefined ? request[key] : defaultValues[key]);
            });

        searchCallback();
    }, isDefault);

    return $elem;
};

agit.elem.ObjectListSearch._fields =
{
    name :
    {
        label : agit.intl.t("Name"),
        name : "name",
        element : new agit.field.Text($("<input type='text' class='form-control input-sm'>"))
    },

    status :
    {
        label : agit.intl.t("Status"),
        name : "status",
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
};

agit.elem.ObjectListSearch.getField = function(name)
{
    return agit.elem.ObjectListSearch._fields[name];
};
