ag.ns("ag.admin");

ag.admin.ObjectListView = function($header, $search, $table)
{
    var $view = new ag.ui.ctxt.View($header, $search, $table);

    $search.setSearchCallback(function(result){
        $table.truncate();

        result && result.length && result.forEach(function(item){
            $table.addItem(item);
        });
    });

    return $view;
};
