ag.ns("ag.admin");

(function(){
var
    objectListView = function(blocks)
    {
        ag.ui.ctxt.View.apply(this, arguments);

        blocks.search.setSearchCallback(function(result){
            blocks.table.truncate();

            result && result.length && result.forEach(function(item){
                blocks.table.addItem(item);
            });
        });
    };

objectListView.prototype = Object.create(ag.ui.ctxt.View.prototype);

ag.admin.ObjectListView = objectListView;
})();
