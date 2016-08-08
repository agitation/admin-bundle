ag.ns("ag.admin");

(function(){
var
    objectListView = function(blocks)
    {
        ag.ui.ctxt.View.apply(this, arguments);

        blocks.search.on("ag.admin.objectsearch.update", (ev, result) => {
            blocks.table.truncate();

            result && result.length && result.forEach(item => {
                blocks.table.addItem(item);
            });
        });
    };

objectListView.prototype = Object.create(ag.ui.ctxt.View.prototype);

ag.admin.ObjectListView = objectListView;
})();
