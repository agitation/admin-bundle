ag.ns("ag.admin");

(function(){

var NavigationPages = function(pages)
{
    this.extend(this, ag.u.tpl("ag-admin-page", ".pages"));
    this.find("ul").html(createList(pages, 1));
},

createList = function(pages, level)
{
    return Object.keys(pages).map(vPath => {
        var page = pages[vPath], elem;

        if (page.children)
        {
            elem = ag.u.tpl("ag-admin-page", ".page-branch");
            elem.find("h3 span").text(page.name);
            elem.find("ul").html(createList(page.children, level + 1));
        }
        else
        {
            elem = ag.u.tpl("ag-admin-page", ".page");
            elem.find("a").attr("href", ag.u.createUrl(vPath)).find("span").text(page.name);
        }

        if (level === 1)
        {
            elem.addClass("item has-flyout")
            .find("> :first-child").addClass("main").end()
            .find("> :nth-child(2)").addClass("flyout");
        }

        return elem.addClass(page.attr || "");
    });
};

NavigationPages.prototype = Object.create(ag.admin.NavigationItem.prototype);

ag.admin.NavigationPages = NavigationPages;

})();
