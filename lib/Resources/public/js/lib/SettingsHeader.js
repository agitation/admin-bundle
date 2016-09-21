ag.ns("ag.admin");

(function(){
var
    settingsHeader = function(pageName)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-settings", ".settings-header"));
        this.find("h2").text(pageName);
    };

settingsHeader.prototype = Object.create(ag.ui.ctxt.Element.prototype);

ag.admin.SettingsHeader = settingsHeader;

})();
