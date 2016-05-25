ag.ns("ag.admin.field");

(function(){
    var
        defaultOptions = [
            { value:  1, text: ag.intl.t("active") },
            { value:  0, text: ag.intl.t("inactive") },
            { value: -1, text: ag.intl.t("deleted") }
        ],

        statusField = function(options)
        {
            this.extend(this, ag.ui.field.Select.call(this, {}, options || defaultOptions));
            this.attr("data-type", "int");
        };

    statusField.prototype = Object.create(ag.ui.field.Select.prototype);

    ag.admin.field.Status = statusField;
})();
