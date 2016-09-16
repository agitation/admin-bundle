ag.ns("ag.admin");

(function(){
var
    entityEditView = function(blocks)
    {
        ag.ui.ctxt.View.call(this, blocks);
        this.addClass("edit");

        this.one("ag.admin.entity.search", () => {
            var header = this.getBlock(ag.admin.EntityEditHeader);
            header && header.setRelativeBacklink(true);
        });
    };

entityEditView.prototype = Object.create(ag.ui.ctxt.View.prototype);

ag.admin.EntityEditView = entityEditView;

})();
