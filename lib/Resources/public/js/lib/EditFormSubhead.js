ag.ns("ag.admin");

(function(){
var
    editFormSubhead = function(text)
    {
        this.extend(this, ag.u.tpl("agitadmin-editview", ".editform-subhead"));
        this.find("h2").text(text);
    };

editFormSubhead.prototype = Object.create(jQuery.prototype);


ag.admin.EditFormSubhead = editFormSubhead;

})();
