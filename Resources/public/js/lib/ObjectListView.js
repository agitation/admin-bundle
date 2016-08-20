ag.ns("ag.admin");

(function(){
var
    valuesAreEqual = function(v1, v2)
    {
        var same = true;

        if (typeof(v1) !== typeof(v2))
        {
            same = false;
        }
        else if (v1 && v2 && typeof(v1) === "object")
        {
            if (Object.keys(v1).length !== Object.keys(v2).length)
                same = false;
            else
                Object.keys(v1).every(key => {
                    return same = valuesAreEqual(v1[key], v2[key]);
                });
        }
        else
        {
            same = (v1 === v2);
        }

        return same;
    },

    search = function()
    {
        var isFreshLoad = this.pageNumber === 1;

        if (this.isPaginated)
        {
            this.request.offset = (this.pageNumber - 1) * this.reqDummy.limit;
            this.request.limit = this.reqDummy.limit + 1;
        }

        if (!this.loading)
        {
            this.loading = true;
            this.blocks.more && this.blocks.more.setIndicatorState(!isFreshLoad).setTriggerState(0);

            ag.srv("api").doCall(
                this.endpoint,
                this.request,
                result => {
                    var added = 0;

                    isFreshLoad && this.blocks.table.truncate();

                    result && result.length && result.forEach(item => {
                        this.reqDummy.limit > added++ && this.blocks.table.addItem(item);
                    });

                    this.loading = false;
                    this.blocks.more && this.blocks.more.setIndicatorState(0).setTriggerState(result && result.length > this.reqDummy.limit);
                },
                isFreshLoad ? null : this.hiddenIndicator // hidden indicator on "more", because there’s a custom one in place
            );
        }
    },

    objectListView = function(endpointName, blocks)
    {
        ag.ui.ctxt.View.call(this, blocks);
        this.addClass("list");

        this.endpoint = new ag.api.Endpoint(endpointName);
        this.reqDummy = new ag.api.Object(this.endpoint.getRequest());
        this.isPaginated = (blocks.more && this.reqDummy.offset !== undefined && this.reqDummy.limit);
        this.hiddenIndicator = new ag.api.Indicator();

        this.defaultValues = blocks.search.getValues();
        this.request = {};

        blocks.search.on("submit", ev => {
            ev.preventDefault();

            this.request = blocks.search.getValues();
            this.pageNumber = 1;

            ag.srv("state").update(null, valuesAreEqual(this.defaultValues, this.request) ? "" : this.request);
            search.call(this);
        });

        blocks.more && blocks.more.submit(ev => {
            ev.preventDefault();
            ++this.pageNumber;
            search.call(this);
        });
    };

objectListView.prototype = Object.create(ag.ui.ctxt.View.prototype);

objectListView.prototype.getActions = function()
{
    // when the request hasn’t changed, we will only trigger a new search if
    // this is a fresh page load.
    var isFirstRun = true;

    return {
        search : request => {

            var currentValues = this.blocks.search.getValues();

            request = request || this.defaultValues;
            this.blocks.search.setValues(request);

            if (isFirstRun || !valuesAreEqual(currentValues, request))
                this.blocks.search.submit();

            isFirstRun = false;
        }
    };
};

ag.admin.ObjectListView = objectListView;

})();
