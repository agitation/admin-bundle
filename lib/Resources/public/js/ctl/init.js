var
    ind = new ag.ui.elem.OverlayIndicator(window),
    msgH = new ag.ui.elem.BubblesMessageHandler();

ag.srv("messageHandler", msgH);
ag.srv("indicator", ind);
ag.srv("api", new ag.api.Api(ind, msgH));
ag.srv("preloader", new ag.admin.Preloader());

ag.srv("menu", new ag.ui.elem.Menu({
    profile : new ag.profile.ProfileMenuEntry(),
    lang : new ag.ui.elem.LanguageMenuEntry(ag.cfg.languages),
    nav : new ag.ui.elem.NavigationMenuEntry(ag.cfg.pages)
}));
