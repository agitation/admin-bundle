ag.ns("ag.admin");

(function(){
var
    listMore = function()
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-listview", ".more"));

        this.doc = $(document);
        this.win = $(window);
        this.spinner = new ag.ui.elem.Spinner();

        this.find(".ind").replaceWith(this.spinner);

        // if the page is at the bottom, we must not trigger, because the
        // browser would keep sticking there and cause an endless loading
        // loop (at least as long as the search returns results).
        this.waitForUpscroll = this.win.scrollTop() + this.win.height() === this.doc.height();
        this.triggerActive = true;

        this.win.scroll(() => {
            var
                docHeight = this.doc.height(),
                winHeight = this.win.height(),
                elemOffset = this.offset().top,
                pageOffset = winHeight + this.win.scrollTop();

            // after the first upscrolling, we can release the lock
            if (pageOffset < docHeight)
                this.waitForUpscroll = false;

            if (this.triggerActive && !this.waitForUpscroll && elemOffset >= pageOffset)
            {
                // we wait a bit to make sure the user isn’t still scrolling
                window.setTimeout(() => {
                    if (this.triggerActive && this.win.scrollTop() + winHeight === docHeight)
                        this.submit();
                }, 500);
            }
        });
    };

    listMore.prototype = Object.create(ag.ui.ctxt.Block.prototype);

    listMore.prototype.setTriggerState = function(active)
    {
        this.triggerActive = active;
        this.waitForUpscroll = this.win.scrollTop() + this.win.height() === this.doc.height();
        return this;
    };

    listMore.prototype.setIndicatorState = function(active)
    {
        this.toggleClass("visible", !!active);
        return this;
    };

    ag.admin.EntityListMore = listMore;
})();
