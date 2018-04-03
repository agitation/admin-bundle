ag.s.msg = new ag.admin.BubblesMessageHandler();

ag.s.nav = new ag.admin.Navigation({
    logout : new ag.admin.NavigationLogout(),
    lang : new ag.admin.NavigationLanguages(ag.cfg.languages),
    pages : new ag.admin.NavigationPages(ag.cfg.pages)
});

ag.s.ind = new ag.admin.OverlayIndicator(window);
