ag.ns("ag.tool");

ag.tool.valuesAreEqual = function(v1, v2) // simple comparison of plain objects
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
                return (same = ag.tool.valuesAreEqual(v1[key], v2[key]));
            });
    }
    else
    {
        same = (v1 === v2);
    }

    return same;
};
