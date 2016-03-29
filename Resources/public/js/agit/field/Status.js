agit.ns("agit.field");

(function(){
    var
        defaultOptions = [
            { value:  1, text: agit.intl.t("active") },
            { value:  0, text: agit.intl.t("inactive") },
            { value: -1, text: agit.intl.t("deleted") }
        ],

        statusField = function(options)
        {
            this.extend(this, agit.field.Select.call(this, {}, options || defaultOptions));
            this.attr("data-type", "int");
        };

    statusField.prototype = Object.create(agit.field.Select.prototype);

    agit.field.Status = statusField;
})();
