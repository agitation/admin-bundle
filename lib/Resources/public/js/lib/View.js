ag.ns("ag.admin");

(function(){

var View = function(blocks)
{
    ag.ui.ctxt.View.call(this, blocks);

    this.header = this.find("header");
    this.body = this.find("article");
    this.footer = this.find("footer");
};

View.prototype = Object.create(ag.ui.ctxt.View.prototype);

View.prototype.nodify = function()
{
    this.extend(this, ag.u.tpl("ag-admin-page", ".view"));
};

View.prototype.attachBlocks = function()
{
    Object.keys(this.blocks).forEach(name => {
        var
            block = this.blocks[name],
            target = this.body;

        if (block instanceof ag.admin.Header)
            target = this.header;
        else if (block instanceof ag.admin.Footer)
            target = this.footer;

        target.append(block);
    });
};

ag.admin.View = View;

})();
