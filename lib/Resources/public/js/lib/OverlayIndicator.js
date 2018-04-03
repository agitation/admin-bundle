ag.ns("ag.admin");

(function(){

var instanceCount = 0,

    OverlayIndicator = function()
    {
        this.overlay = ag.u.tpl("ag-admin-indicator", ".overlay-indicator");
        this.overlay.hide().appendTo($("body"));

        this.spinner = new ag.ui.elem.Spinner();
        this.spinner.appendTo(this.overlay.find(".anim"));
    };

OverlayIndicator.prototype = Object.create(ag.api.Indicator.prototype);

OverlayIndicator.prototype.start = function()
{
    ++instanceCount;

    if (instanceCount === 1)
    {
        this.spinner.show();
        this.overlay.show();
    }
};

OverlayIndicator.prototype.halt = function(callback)
{
    --instanceCount;

    if (!instanceCount)
    {
        this.spinner.hide();
        this.overlay.hide();
    }

    callback && callback();
};

ag.admin.OverlayIndicator = OverlayIndicator;

})();
