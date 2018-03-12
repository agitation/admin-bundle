ag.ns("ag.admin");

(function(){

var Preloader = function()
    {
        this.callbacks = { entities : {}, settings : {} };
        this.data = { entities : {}, settings : {} };
        this.loaded = false;
    },

    load = function(type, name, callback)
    {
        if (this.loaded)
        {
            // we are able to return loaded items to non-subscribed callers even after loading,
            // but only for entities that had been registered
            callback(this.data[type][name]);
        }
        else
        {
            if (!this.callbacks[type][name])
                this.callbacks[type][name] = [];

            this.callbacks[type][name].push(callback);
        }
    };

Preloader.prototype.loadEntity = function(name, callback)
{
    load.call(this, "entities", name, callback);
};

Preloader.prototype.loadSetting = function(name, callback)
{
    load.call(this, "settings", name, callback);
};

Preloader.prototype.count = function()
{
    return Object.keys(this.callbacks.entities).length + (Object.keys(this.callbacks.settings).length ? 1 : 0);
};

Preloader.prototype.run = function(finishCallback)
{
    var
        eNames = Object.keys(this.callbacks.entities),
        sNames = Object.keys(this.callbacks.settings),
        regCount = eNames.length + (sNames.length ? 1 : 0),
        callCount = 0;

    sNames.length && ag.s.api.doCall(
        "admin.v1/Settings.load",
        sNames,
        settingList => {
            this.data.settings = {};

            settingList.forEach(setting => {
                this.data.settings[setting.id] = setting.value;
                this.callbacks.settings[setting.id].forEach(sCallback => sCallback(setting.value));
            });

            ++callCount === regCount && finishCallback();
        });

    // entities
    eNames.forEach(name => {
        var endpoint = new ag.api.Endpoint(name + ".search");

        this.data.entities = {};

        ag.s.api.doCall(
            endpoint,
            new ag.api.Object(endpoint.getRequest(), { deleted : false }),
            entityList => {
                this.data.entities[name] = entityList;
                this.callbacks.entities[name].forEach(eCallback => eCallback(entityList));
                ++callCount === regCount && finishCallback();
            });
    });

    this.loaded = true;
};

ag.s.preloader = new Preloader();

})();
