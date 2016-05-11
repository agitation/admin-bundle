$(document).ready(function() {
    var
        ind = new agit.misc.OverlayIndicator(window),
        msgH = new agit.misc.msgh.Bubbles();

    agit.srv("state", new agit.context.State());
    agit.srv("messageHandler", msgH);
    agit.srv("indicator", ind);
    agit.srv("api", new agit.common.Api(ind, msgH));
    agit.srv("preloader", new agit.common.Preloader());

    $('body').tooltip({
        selector: "[data-toggle='tooltip']",
        template: agit.tool.tpl("agitadmin-tooltip", ".tooltip"),
        container: 'body',
        animation : false
    });
});
