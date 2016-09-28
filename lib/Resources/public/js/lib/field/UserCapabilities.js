ag.ns("ag.admin.field");

(function(){
    var
        updateRoleCapabilities = function(resetExtra)
        {
            var
                role = this.roleField ? this.roleField.getSelectedEntity() : null,
                isSuper = role && role.isSuper,
                roleCaps = role ? role.capabilities.map(cap => cap.id) : [],
                extraCaps = resetExtra ? [] : this.getValue();

            Object.keys(this.tags).forEach(id => {
                var
                    locked = isSuper || roleCaps.indexOf(id) >= 0,
                    active = locked || extraCaps.indexOf(id) >= 0;
                this.tags[id].setValue(active);
                this.tags[id][locked ? "lock" : "unlock"]();
            });
        },

        userCaps = function()
        {
            ag.admin.field.Tags.apply(this, arguments);
        };

    userCaps.prototype = Object.create(ag.admin.field.Tags.prototype);

    userCaps.prototype.setValue = function(value)
    {
        value.length && value.forEach(entity => this.tags[entity.id].setValue(true));
        updateRoleCapabilities.call(this, false);
        this.triggerHandler("ag.field.set");
        return this;
    };

    userCaps.prototype.setRoleField = function(roleField)
    {
        this.roleField = roleField;
        roleField.on("change ag.field.set", updateRoleCapabilities.bind(this, true));
    };

    ag.admin.field.UserCapabilities = userCaps;
})();
