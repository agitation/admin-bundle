ag.ns("ag.admin");

(function(){
var
    cloneModal = function(fields, successCallback)
    {
        ag.admin.FormModal.call(this, fields, successCallback);
        this.elements.header.show().html(ag.ui.tool.tpl("agitadmin-forms", ".clone-modal-header"));
        this.elements.main.after(ag.ui.tool.tpl("agitadmin-forms", ".clone-modal-info"));
    };

cloneModal.prototype = Object.create(ag.admin.FormModal.prototype);

ag.admin.CloneModal = cloneModal;
})();
