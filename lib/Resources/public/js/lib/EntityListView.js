ag.ns("ag.admin");

(function(){
var search = function()
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
                        if (this.reqDummy.limit === undefined || this.reqDummy.limit > added++)
                            this.blocks.table.addItem(item);
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

            ag.srv("state").update(null, ag.tool.valuesAreEqual(this.defaultValues, this.request) ? "" : this.request);
            search.call(this);
        });

        blocks.search.on("reset", ev => {
            ev.preventDefault();
            blocks.search.setValues(this.defaultValues);

            ag.tool.valuesAreEqual(this.defaultValues, this.request) ||
                blocks.search.trigger("submit");
        });

        this.on("ag.admin.entity.update", (ev, obj) => {
            obj && blocks.table.contains(obj.id) && blocks.table.updateItem(obj);
        });

        this.on("ag.admin.entity.create", () => {
            this.dirty = true;
        });

        blocks.more && blocks.more.submit(ev => {
            ev.preventDefault();
            ++this.pageNumber;
            search.call(this);
        });
    };

entityListView.prototype = Object.create(ag.ui.ctxt.View.prototype);

entityListView.prototype.getTitle = function()
{
    return ag.intl.t("Overview");
};

entityListView.prototype.getActions = function()
{
    return {
        search : request => {

            var currentValues = this.blocks.search.getValues();

            request = request || this.defaultValues;
            this.blocks.search.setValues(request);

            if (this.dirty || !ag.tool.valuesAreEqual(currentValues, request))
                this.blocks.search.submit();

            this.dirty = false;
        }
    };
};

ag.admin.EntityListView = entityListView;

})();
