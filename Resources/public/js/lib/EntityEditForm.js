ag.ns("ag.admin");

ag.admin.EntityEditForm = function(entityName, fields)
{
    var
        $form = ag.ui.tool.tpl("agitadmin-editview", ".editview-form"),
        $table = $form.find("table"),
        $tbody = $form.find("tbody").empty(),
        apiService = ag.srv("api"),

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
            $row = ag.ui.tool.tpl("agitadmin-editview", ".editview-form tbody tr");

        $row.find("th label").text(field.label);
        $row.find("td").html(field.element);

        field.optional || $row.find("th .optional").remove();
        $tbody.append($row);
    });

    ag.srv("state").registerViewElement("/edit/form", function(request){
        if (request === "new")
            fillForm(new ag.api.Object(entityName));

        else if (request && !isNaN(request))
            apiService.doCall(entityName + ".get", request, fillForm);
    });

    $form.on("reset", function(ev){
        ag.ui.ctxt.Form.stopEvent(ev);
        fillForm(entity);
    });

    $form.on("submit", function(ev){
        ag.ui.ctxt.Form.stopEvent(ev);

        var values = {};

        Object.keys(fields).forEach(function(key){
            values[key] = fields[key].element.getValue();
        });

        apiService.doCall(
            entityName + "." + (values.id ? "update" : "create"),
            values,
            function(res, status)
            {
                if (status === 200)
                {
                    var successMsg = values.id
                        ? ag.intl.t("The object was updated successfully.")
                        : ag.intl.t("The object was created successfully.");

                    ag.srv("messageHandler").showMessage(new ag.common.Message(successMsg, "success"));

                    fillForm(res.payload);

                    values.id || ag.srv("state").update("/edit/form", res.payload.id);
                }
            }
        );

    });

    return $form;
};
