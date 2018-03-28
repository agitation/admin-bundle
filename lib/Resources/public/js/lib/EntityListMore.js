ag.ns("ag.admin");

(function(){

var EntityListMore = function()
{
    this.extend(this, ag.u.tpl("agitadmin-listview", ".more"));
    this.find("button").on("click", () => this.submit());
};

EntityListMore.prototype = Object.create(ag.ui.ctxt.Block.prototype);

EntityListMore.prototype.setVisibility = function(visible)
{
    this.toggleClass("visible", !!visible);
    return this;
};

ag.admin.EntityListMore = EntityListMore;

})();
