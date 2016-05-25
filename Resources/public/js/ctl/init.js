$(document).ready(function() {
    var
        ind = new ag.ui.elem.OverlayIndicator(window),
        msgH = new ag.ui.elem.BubblesMessageHandler();

    ag.srv("state", new ag.ui.ctxt.State());
    ag.srv("messageHandler", msgH);
    ag.srv("indicator", ind);
    ag.srv("api", new ag.api.Api(ind, msgH));
    ag.srv("preloader", new ag.api.Preloader());

    $('body').tooltip({
        selector: "[data-toggle='tooltip']",
        template: ag.ui.tool.tpl("agitadmin-tooltip", ".tooltip"),
        container: 'body',
        animation : false
    });
});
