ag.ns("ag.admin.field");

(function(){
    var
        periodField = function(minRange, maxRange)
        {
            this.extend(this, ag.u.tpl("agitadmin-forms", ".period-field"));

            this.today = new ag.common.Date();
            this.dpFrom = new ag.ui.field.Datepicker(null, this.today);
            this.dpUntil = new ag.ui.field.Datepicker(null, this.today);
            this.dpFrom.connectWith(this.dpUntil, minRange, maxRange);

            this.find(".from").replaceWith(this.dpFrom);
            this.find(".until").replaceWith(this.dpUntil);
        };

    periodField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    periodField.prototype.setTargetId = function(id)
    {
        this.dpFrom.setTargetId(id);
        return this;
    };

    periodField.prototype.setValue = function(value)
    {
        value = value || {};

        this.dpFrom.setValue(value.from || this.today);
        this.dpUntil.setValue(value.until || this.today);

        this.triggerHandler("ag.field.set");
        return this;
    };

    periodField.prototype.getValue = function()
    {
        return this.disabled ? null : {
            from : this.dpFrom.getValue(),
            until : this.dpUntil.getValue()
        };
    };

    periodField.prototype.disable = function()
    {
        ag.ui.field.ComplexField.prototype.disable.call(this);
        this.dpFrom.disable();
        this.dpUntil.disable();
    };

    periodField.prototype.enable = function()
    {
        ag.ui.field.ComplexField.prototype.enable.call(this);
        this.dpFrom.enable();
        this.dpUntil.enable();
    };

    ag.admin.field.Period = periodField;
})();
