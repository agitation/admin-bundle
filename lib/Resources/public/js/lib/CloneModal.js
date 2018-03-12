ag.ns("ag.admin");

(function(){
var
    cloneModal = function(fields, submitCallback)
    {
        ag.admin.FormModal.call(this, fields, submitCallback);
        this.find(".header").html(ag.u.tpl("agitadmin-forms", ".clone-modal-header"));
        this.find(".footer").before(ag.u.tpl("agitadmin-forms", ".clone-modal-info"));
    };

cloneModal.prototype = Object.create(ag.admin.FormModal.prototype);

ag.admin.CloneModal = cloneModal;
})();
