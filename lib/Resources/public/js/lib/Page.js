ag.ns("ag.admin");

(function(){

var Page = function(navigation, views)
{
    this.nav = navigation;
    this.views = views;

    this.nodify();
    this.addChildren({ nav : navigation, views : views });
};

Page.prototype = Object.create(ag.ui.ctxt.Element.prototype);

Page.prototype.nodify = function()
{
    this.extend(this, $("main")).empty();
};

Page.prototype.initialize = function()
{
    ag.s.broker.pub("ag.page.init");
};

ag.admin.Page = Page;

})();
