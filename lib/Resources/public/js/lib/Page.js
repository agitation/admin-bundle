ag.ns("ag.admin");

(function(){
var Page = function(views)
{
    ag.app.Page.call(this, ag.srv("nav"), views);

    var entityEvents = ["search", "create", "update", "delete", "undelete", "remove"].map(val => "ag.admin.entity." + val);

    this.on(entityEvents.join(" "), (ev, data) => {
        data = $.isArray(data) ? [data] : data;
        Object.keys(this._children).forEach(child => this._children[child].triggerHandler(ev.type + "." + ev.namespace, data));
    });
};

Page.prototype = Object.create(ag.app.Page.prototype);

Page.prototype.initialize = function()
{
    var
        indicator = ag.srv("indicator"),
        preloader = ag.srv("preloader"),
        parentInit = ag.app.Page.prototype.initialize.bind(this);

    if (preloader.count())
    {
        indicator.start();
        preloader.run(parentInit);
        indicator.halt();
    }
    else
    {
        parentInit();
    }
};

ag.admin.Page = Page;

})();
