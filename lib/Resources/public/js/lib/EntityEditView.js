ag.ns("ag.admin");

(function(){

var entityEditView = function(blocks)
{
    ag.admin.View.call(this, blocks);
    this.addClass("edit");

    var header = this.getChild(ag.admin.EntityEditHeader, true);
    header && this.one("ag.admin.entity.search", () => header.setRelativeBacklink());
};

entityEditView.prototype = Object.create(ag.admin.View.prototype);

ag.admin.EntityEditView = entityEditView;

})();
