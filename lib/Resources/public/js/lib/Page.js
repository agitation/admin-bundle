ag.ns("ag.admin");

(function(){
var Page = function(viewCollector)
{
    ag.app.Page.call(this, ag.s.nav, viewCollector);

    var entityEvents = ["search", "create", "update", "delete", "undelete", "remove"].map(val => "ag.admin.entity." + val),
        views = viewCollector.getViews();

    this.on(entityEvents.join(" "), (ev, data) => {
        data = $.isArray(data) ? [data] : data;
        Object.keys(views).forEach(child => views[child].triggerHandler(ev.type + "." + ev.namespace, data));
    });
};

Page.prototype = Object.create(ag.app.Page.prototype);

Page.prototype.initialize = function()
{
    var parentInit = ag.app.Page.prototype.initialize.bind(this);

    if (ag.s.preloader.count())
    {
        ag.s.ind.start();

        ag.s.preloader.run(() => {
            parentInit();
            ag.s.ind.halt();
        });
    }
    else
    {
        parentInit();
    }
};

ag.admin.Page = Page;

})();
