var
    ind = new ag.ui.elem.OverlayIndicator(window),
    msgH = new ag.admin.BubblesMessageHandler();

ag.srv("messageHandler", msgH);
ag.srv("indicator", ind);
ag.srv("api", new ag.api.Api(ind, msgH));
ag.srv("preloader", new ag.admin.Preloader());

ag.srv("nav", new ag.app.Navigation({
    logout : new ag.profile.NavigationLogout(),
    lang : new ag.app.NavigationLanguages(ag.cfg.languages),
    pages : new ag.app.NavigationPages(ag.cfg.pages)
}));
