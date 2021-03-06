ag.ns("ag.admin.field");

(function(){
    var tagField = function(entity, state)
    {
        this.extend(this, ag.u.tpl("agitadmin-forms", ".tag"));
        this.find("span").text(ag.u.out(entity.name));

        this.click(() => this.is(".locked") || this.toggleClass("active"));

        state && this.setValue(true);
    };

    tagField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    tagField.prototype.setValue = function(value)
    {
        this.toggleClass("active", value).triggerHandler("ag.field.set");
        return this;
    };

    tagField.prototype.getValue = function()
    {
        return this.is(".active");
    };

    tagField.prototype.lock = function()
    {
        return this.addClass("locked");
    };

    tagField.prototype.unlock = function()
    {
        return this.removeClass("locked");
    };

    ag.admin.field.Tag = tagField;
})();
