ag.s.msg = new ag.admin.BubblesMessageHandler();

ag.s.nav = new ag.app.Navigation({
    logout : new ag.app.NavigationLogout(),
    lang : new ag.app.NavigationLanguages(ag.cfg.languages),
    pages : new ag.app.NavigationPages(ag.cfg.pages)
});

ag.s.ind = new ag.app.OverlayIndicator(window);
