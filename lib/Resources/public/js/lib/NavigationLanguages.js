ag.ns("ag.admin");

/*
    expects a list of objects, each describing a languange version, e.g.

    {
        url : "/en",
        name : "english",
        isCurrent : false
    }
 */

ag.admin.NavigationLanguages = function(languages)
{
    if (languages.length > 1)
    {
        this.extend(this, ag.u.tpl("ag-admin-page", ".languages"));

        var list = this.find("ul"),
            stateManager = ag.s.state,
            broker = ag.s.broker;

        Object.keys(languages).forEach(name =>{
            var
            entry = languages[name],
            li = ag.u.tpl("ag-admin-page", ".language"),
            link = li.find("a").attr("href", entry.url).text(entry.name).addClass(entry.isCurrent ? "current" : "");

            broker.sub(
                "ag.state.init ag.state.change ag.state.update",
                (state, hash) => { link.attr("href", entry.url + hash); }
            );

            link.attr("href", entry.url + stateManager.getCurrentHash());

            list.append(li);
        });
    }
};

ag.admin.NavigationLanguages.prototype = Object.create(ag.admin.NavigationItem.prototype);
