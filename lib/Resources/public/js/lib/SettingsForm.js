ag.ns("ag.admin");

(function(){
var SettingsForm = function(fields)
{
    this.extend(this, ag.u.tpl("agitadmin-settings", ".settings-form"));

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

        ag.s.api.doCall(
            "admin.v1/Settings.save",
            settings,
            (result, status) => {
                if (status === 200)
                {
                    this.settings = toMap(result);
                    fillForm.call(this, this.settings);
                    this.trigger("ag.admin.settings.save", result);
                    ag.s.msg.alert(ag.intl.t("The settings have been saved successfully."), "success");
                }
            }
        );
    });

    this.registerController(() => ag.s.api.doCall(
        "admin.v1/Settings.load",
        Object.keys(this.fields),
        result => {
            this.settings = toMap(result);
            fillForm.call(this, this.settings);
        }
    ));
},

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
};

SettingsForm.prototype = Object.create(ag.ui.ctxt.Block.prototype);

ag.admin.SettingsForm = SettingsForm;

})();
