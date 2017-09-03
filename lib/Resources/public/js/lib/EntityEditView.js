ag.ns("ag.admin");

(function(){

var entityEditView = function(blocks)
{
    ag.ui.ctxt.View.call(this, blocks);
    this.addClass("edit");

    var header = this.getChild(ag.admin.EntityEditHeader, true);
    header && this.one("ag.admin.entity.search", () => header.setRelativeBacklink());
};

entityEditView.prototype = Object.create(ag.ui.ctxt.View.prototype);

entityEditView.prototype.getTitle = function()
{
    return ag.intl.t("Edit");
};

ag.admin.EntityEditView = entityEditView;

})();
