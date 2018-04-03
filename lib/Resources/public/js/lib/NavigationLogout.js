ag.ns("ag.admin");

(function(){

var NavigationLogout = function()
{
    var indicator = new ag.admin.OverlayIndicator(window);

    this.extend(this, ag.u.tpl("agitadmin-forms", ".profile"));

    this.find(".logout").click(function(){
        // show an extra indicator that keeps running until the page reloads
        indicator.start();

        ag.s.api.doCall("admin.v1/Session.logout", null, (result, status) => {
            if (status === 200)
            {
                location.reload();
            }
            else
            {
                indicator.halt();
            }
        }, indicator);
    });
};

NavigationLogout.prototype = Object.create(ag.admin.NavigationItem.prototype);

ag.admin.NavigationLogout = NavigationLogout;

})();
