ag.ns("ag.admin");

(function(){

var Navigation = function(items)
{
    this.extend(this, ag.u.tpl("ag-admin-page", ".nav"));
    this.addChildren(items, false);

    var container = this.find(".items"),
        showNav = this.showNav.bind(this),
        hideNav = this.hideNav.bind(this);

    Object.keys(items).forEach(idx => container.append(items[idx]));

    this.find(".caption").text($("title").text());

    this.find(".control a").click(showNav);
    this.find(".olay").click(hideNav);
    ag.s.broker.sub("ag.state.change", hideNav);
};

Navigation.prototype = Object.create(ag.admin.Header.prototype);

Navigation.prototype.showNav = function()
{
    this.addClass("open");
};

Navigation.prototype.hideNav = function()
{
    this.removeClass("open");
};

ag.admin.Navigation = Navigation;

})();
