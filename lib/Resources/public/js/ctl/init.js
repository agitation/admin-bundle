var
    ind = new ag.ui.elem.OverlayIndicator(window),
    msgH = new ag.admin.BubblesMessageHandler();

ag.srv("messageHandler", msgH);
ag.srv("indicator", ind);
ag.srv("api", new ag.api.Api(ind, msgH));
ag.srv("preloader", new ag.admin.Preloader());

ag.srv("nav", new ag.ui.elem.Navigation({
    lang : new ag.ui.elem.NavigationLanguages(ag.cfg.languages),
    logout : new ag.profile.NavigationLogout(),
    pages : new ag.ui.elem.NavigationPages(ag.cfg.pages)
}));
