ag.ns("ag.admin");

(function(){
var
    editFormSubhead = function(text)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-editview", ".editform-subhead"));
        this.find("h2").text(text);
    };

editFormSubhead.prototype = Object.create(ag.ui.ctxt.Element.prototype);


ag.admin.EditFormSubhead = editFormSubhead;

})();
