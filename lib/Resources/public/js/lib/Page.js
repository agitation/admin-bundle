ag.ns("ag.admin");

(function(){
var
    adminPage = function()
    {
        ag.ui.ctxt.Page.apply(this, arguments);

        var entityEvents = ["search", "create", "update", "delete", "undelete", "remove"].map(val => "ag.admin.entity." + val);

        this.on(entityEvents.join(" "), (ev, data) => {
            data = $.isArray(data) ? [data] : data;
            Object.keys(this.views).forEach(view => this.views[view].triggerHandler(ev.type + "." + ev.namespace, data));
        });
    };

adminPage.prototype = Object.create(ag.ui.ctxt.Page.prototype);

adminPage.prototype.initialize = function()
{
    var
        indicator = ag.srv("indicator"),
        preloader = ag.srv("preloader"),
        parentInit = ag.ui.ctxt.Page.prototype.initialize.bind(this);

    if (preloader.count())
    {
        indicator.start();
        preloader.run(parentInit);
        indicator.finish();
    }
    else
    {
        parentInit();
    }
};

ag.admin.Page = adminPage;

})();
