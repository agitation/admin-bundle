ag.ns("ag.admin.field");

(function(){
    var oneToManyRow = function()
    {
        this.nodify();
        this.find(".remove button").click(() => this.trigger("ag.admin.onetomany.remove", this.getValue()).remove());
    };

    oneToManyRow.prototype = Object.create(ag.admin.field.Object.prototype);

    ag.admin.field.OneToManyRow = oneToManyRow;
})();
