ag.ns("ag.admin");

(function(){

var EntityListView = function(endpointName, blocks)
{
    ag.app.View.call(this, blocks);
    this.addClass("list-view");

    this.knownChild = {
        search : this.getChild(ag.admin.EntityListSearch, true),
        table : this.getChild(ag.admin.EntityListTable, true),
        more : this.getChild(ag.admin.EntityListMore, true)
    };

    this.endpoint = new ag.api.Endpoint(endpointName);
    this.reqDummy = new ag.api.Object(this.endpoint.getRequest());
    this.isPaginated = (this.knownChild.more && this.reqDummy.offset !== undefined && this.reqDummy.limit);
    this.hiddenIndicator = new ag.api.Indicator();
    this.defaultValues = this.knownChild.search.getValues();
    this.request = {};
    this.dirty = true;

    this.knownChild.search.on("submit", ev => {
        ev.preventDefault();

        this.request = this.knownChild.search.getValues();
        this.pageNumber = 1;

        var isDefault = ag.tool.valuesAreEqual(this.defaultValues, this.request);
        this.knownChild.search.toggleClass("default", isDefault);

        ag.srv("state").update(null, isDefault ? "" : this.request);
        search.call(this);
    });

    this.knownChild.search.on("reset", ev => {
        ev.preventDefault();
        this.knownChild.search.setValues(this.defaultValues);

        ag.tool.valuesAreEqual(this.defaultValues, this.request) ||
            this.knownChild.search.trigger("submit");
    });

    this.on("ag.admin.entity.update", (ev, obj) => {
        obj && this.knownChild.table.contains(obj.id) && this.knownChild.table.updateItem(obj);
    });

    this.on("ag.admin.entity.create", () => {
        this.dirty = true;
    });

    this.knownChild.more && this.knownChild.more.submit(ev => {
        ev.preventDefault();
        ++this.pageNumber;
        search.call(this);
    });

    this.registerController(request => {
        var currentValues = this.knownChild.search.getValues();

        request = request || this.defaultValues;
        this.knownChild.search.setValues(request);

        if (this.dirty || !ag.tool.valuesAreEqual(currentValues, request))
            this.knownChild.search.submit();

        this.dirty = false;
    });
},

search = function()
{
    var
        isFreshLoad = this.pageNumber === 1,
        request = $.extend({}, this.request);

    if (this.isPaginated)
    {
        request.offset = (this.pageNumber - 1) * this.reqDummy.limit;
        request.limit = this.reqDummy.limit + 1;
    }

    if (!this.loading)
    {
        this.loading = true;
        this.knownChild.more && this.knownChild.more.setVisibility(0);

        ag.srv("api").doCall(
            this.endpoint,
            request,
            result => {
                var added = 0;

                isFreshLoad && this.knownChild.table.truncate();

                result && result.length && result.forEach(item => {
                    if (this.reqDummy.limit === undefined || this.reqDummy.limit > added++)
                        this.knownChild.table.addItem(item);
                });

                this.loading = false;
                this.knownChild.more && this.knownChild.more.setVisibility(result && result.length > this.reqDummy.limit);

                this.trigger("ag.admin.entity.search", request);
            }
        );
    }
};

EntityListView.prototype = Object.create(ag.app.View.prototype);

ag.admin.EntityListView = EntityListView;

})();
