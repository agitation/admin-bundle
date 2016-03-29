agit.ns("agit.elem");

agit.elem.EntityEditForm = function(entityName, fields)
{
    var
        $form = agit.tool.tpl(".editview-form"),
        $table = $form.find("table"),
        $tbody = $form.find("tbody").empty(),
        apiService = agit.srv("api"),

        entity, // currently saved state of the entity. NOT TO BE MODIFIED!

        fillForm = function(ent)
        {
            entity = ent;

            entity && Object.keys(fields).forEach(function(key){
                entity[key] !== undefined && fields[key].element.setValue(entity[key]);
            });
        };

    Object.keys(fields).forEach(function(key){
        var
            field = fields[key],
            $row = agit.tool.tpl(".editview-form tbody tr");

        $row.find("th label").text(field.label);
        $row.find("td").html(field.element);

        field.optional || $row.find("th .optional").remove();
        $tbody.append($row);
    });

    agit.srv("state").registerViewElement("/edit/form", function(request){
        if (request === "new")
            fillForm(new agit.api.Object(entityName));

        else if (request && !isNaN(request))
            apiService.doCall(entityName + ".get", request, fillForm);
    });

    $form.on("reset", function(ev){
        agit.common.Form.stopEvent(ev);
        fillForm(entity);
    });

    $form.on("submit", function(ev){
        agit.common.Form.stopEvent(ev);

        var values = {};

        Object.keys(fields).forEach(function(key){
            values[key] = fields[key].element.getValue();
        });

        apiService.doCall(
            entityName + "." + (values.id ? "update" : "create"),
            values,
            function(res)
            {
                if (res.success)
                {
                    var successMsg = values.id
                        ? agit.intl.L10n.t("The object was updated successfully.")
                        : agit.intl.L10n.t("The object was created successfully.");

                    agit.srv("messageHandler").showMessage(new agit.common.Message(successMsg, "success"));

                    fillForm(res.payload);

                    values.id || agit.srv("state").update("/edit/form", res.payload.id);
                }
            },
            { fullResponse : true }
        );

    });

    return $form;
};
