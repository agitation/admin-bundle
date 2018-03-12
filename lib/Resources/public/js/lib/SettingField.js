ag.ns("ag.admin");

(function(){
var
    settingField = function(label, field, description)
    {
        this.extend(this, ag.u.tpl("agitadmin-settings", ".setting-field"));
        this.find("th label").text(label);
        this.find("td .field").html(field);

        if (description)
            this.find("td .description").html(description);
        else
            this.find("td .description").remove();

        this.field = field;
    };

settingField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

settingField.prototype.getValue = function()
{
    return this.field.getValue();
};

settingField.prototype.setValue = function(value)
{
    this.field.setValue(value);
    this.triggerHandler("ag.field.set");
    return this;
};

ag.admin.SettingField = settingField;

})();
