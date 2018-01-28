ag.ns("ag.admin");

(function(){

var entityEditView = function(blocks)
{
    ag.app.View.call(this, blocks);
    this.addClass("edit");

    var header = this.getChild(ag.admin.EntityEditHeader, true);
    header && this.one("ag.admin.entity.search", () => header.setRelativeBacklink());
};

entityEditView.prototype = Object.create(ag.app.View.prototype);

ag.admin.EntityEditView = entityEditView;

})();
