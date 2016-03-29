agit.ns("agit.context");

agit.context.ObjectListView = function($header, $search, $table)
{
    var $view = new agit.context.View($header, $search, $table);

    $search.setSearchCallback(function(result){
        $table.truncate();

        result && result.length && result.forEach(function(item){
            $table.addItem(item);
        });
    });

    return $view;
};
