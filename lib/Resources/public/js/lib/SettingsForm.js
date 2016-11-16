ag.ns("ag.admin");

(function(){
var
    toMap = function(settingCollection)
    {
        var map = {};

        settingCollection.forEach(setting => map[setting.id] = setting.value);

        return map;

    },

    fillForm = function(settings)
    {
        Object.keys(settings).forEach(name => {
            this.fields[name].setValue(settings[name]);
        });
    },

    settingsForm = function(fields)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-settings", ".settings-form"));

        this.tfoot = this.find("tfoot");
        this.fields = {};
        this.settings = {}; // last saved settings, used for resetting the form

        Object.keys(fields).forEach(name => {
            this.tfoot.before(fields[name]);

            if (fields[name] instanceof ag.admin.SettingField)
                this.fields[name] = fields[name];
        });

        this.on("reset", ev => {
            ev.preventDefault();
            fillForm.call(this, this.settings);
        });

        this.on("submit", ev => {
            ev.preventDefault();

            var settings = [];

            Object.keys(this.fields).forEach(name => {
                settings.push(new ag.api.Object("admin.v1/Setting", {
                    id : name,
                    value : this.fields[name].getValue()
                }));
            });

            ag.srv("api").doCall(
                "admin.v1/Settings.save",
                settings,
                (result, status) => {
                    if (status === 200)
                    {
                        this.settings = toMap(result);
                        fillForm.call(this, this.settings);
                        this.trigger("ag.admin.settings.save", result);
                        ag.srv("messageHandler").alert(ag.intl.t("The settings have been saved successfully."), "success");
                    }
                }
            );
        });
    };

settingsForm.prototype = Object.create(ag.ui.ctxt.Block.prototype);

settingsForm.prototype.getAction = function()
{
    return () => ag.srv("api").doCall(
        "admin.v1/Settings.load",
        Object.keys(this.fields),
        result => {
            this.settings = toMap(result);
            fillForm.call(this, this.settings);
        }
    );
};
ag.admin.SettingsForm = settingsForm;

})();
