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
            this.blocks.more && this.blocks.more.setIndicatorState(!isFreshLoad).setTriggerState(0);

            ag.srv("api").doCall(
                this.endpoint,
                request,
                result => {
                    var added = 0;

                    isFreshLoad && this.blocks.table.truncate();

                    result && result.length && result.forEach(item => {
                        this.reqDummy.limit > added++ && this.blocks.table.addItem(item);
                    });

                    this.loading = false;
                    this.blocks.more && this.blocks.more.setIndicatorState(0).setTriggerState(result && result.length > this.reqDummy.limit);

                    this.trigger("ag.admin.entity.search", request);
                },
                isFreshLoad ? null : this.hiddenIndicator // hidden indicator on "more", because there’s a custom one in place
            );
        }
    },

    entityListView = function(endpointName, blocks)
    {
        ag.ui.ctxt.View.call(this, blocks);
        this.addClass("list");

        this.endpoint = new ag.api.Endpoint(endpointName);
        this.reqDummy = new ag.api.Object(this.endpoint.getRequest());
        this.isPaginated = (blocks.more && this.reqDummy.offset !== undefined && this.reqDummy.limit);
        this.hiddenIndicator = new ag.api.Indicator();
        this.defaultValues = blocks.search.getValues();
        this.request = {};
        this.dirty = true;

        blocks.search.on("submit", ev => {
            ev.preventDefault();

            this.request = blocks.search.getValues();
            this.pageNumber = 1;

            ag.srv("state").update(null, valuesAreEqual(this.defaultValues, this.request) ? "" : this.request);
            search.call(this);
        });

        blocks.search.on("reset", ev => {
            ev.preventDefault();
            blocks.search.setValues(this.defaultValues);

            valuesAreEqual(this.defaultValues, this.request) ||
                blocks.search.trigger("submit");
        });

        this.on("ag.admin.entity.update", (ev, obj) => {
            blocks.table.contains(obj.id) && blocks.table.updateItem(obj);
        });

        this.on("ag.admin.entity.create", (ev, obj) => {
            this.dirty = true;
        });

        blocks.more && blocks.more.submit(ev => {
            ev.preventDefault();
            ++this.pageNumber;
            search.call(this);
        });
    };

entityListView.prototype = Object.create(ag.ui.ctxt.View.prototype);

entityListView.prototype.getActions = function()
{
    return {
        search : request => {

            var currentValues = this.blocks.search.getValues();

            request = request || this.defaultValues;
            this.blocks.search.setValues(request);

            if (this.dirty || !valuesAreEqual(currentValues, request))
                this.blocks.search.submit();

            this.dirty = false;
        }
    };
};

ag.admin.EntityListView = entityListView;

})();
