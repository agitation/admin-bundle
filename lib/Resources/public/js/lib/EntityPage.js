ag.ns("ag.admin");

(function(){
var
    entityPage = function()
    {
        ag.ui.ctxt.Page.apply(this, arguments);

        this.on("ag.admin.entity.search ag.admin.entity.create ag.admin.entity.update ag.admin.entity.delete ag.admin.entity.undelete ag.admin.entity.remove", (ev, data) => {
            data = $.isArray(data) ? [data] : data;
            Object.keys(this.views).forEach(view => this.views[view].triggerHandler(ev.type + "." + ev.namespace, data));
        });
    };

entityPage.prototype = Object.create(ag.ui.ctxt.Page.prototype);

ag.admin.EntityPage = entityPage;

})();
