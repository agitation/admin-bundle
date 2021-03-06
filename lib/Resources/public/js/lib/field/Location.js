ag.ns("ag.admin.field");

(function(){
    var
        defaultLonLat = [51, 10],
        defaultZoom = 5,
        locationZoom = 14,

        locationField = function()
        {
            var map = new ag.ui.elem.Map();

            this.extend(this, ag.u.tpl("agitadmin-location-field", ".location-field")).prepend(map);

            map.addClass("select");

            this.map = map;
            this.marker = map.createMarker();
            this.currentLocation = null;

            this.map.lMap.on("click", ev => {
                var location = ev.latlng;
                this.currentLocation = { lon : location.lng, lat : location.lat };
                this.marker.setOpacity(1).setLatLng(location);
            });
        };

    locationField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    locationField.prototype.setValue = function(location)
    {
        if (location instanceof Object && location.lon && location.lat)
        {
            var latlng = [ location.lat, location.lon ];

            this.marker.setOpacity(1).setLatLng(latlng);
            this.map.lMap.setView(latlng, locationZoom);
            this.currentLocation = location;
        }
        else
        {
            this.clear();
        }

        this.triggerHandler("ag.field.set");
        return this;
    };

    locationField.prototype.clear = function()
    {
        this.currentLocation = null;
        this.marker.setOpacity(0);
        this.map.lMap.setView(defaultLonLat, defaultZoom);
        this.map.lMap.setZoom(4);

        return this;
    };

    locationField.prototype.validate = function()
    {
        if (!this.currentLocation)
            throw new Error(ag.intl.t("Please select a location."));
    };

    locationField.prototype.getValue = function()
    {
        return this.currentLocation;
    };

    ag.admin.field.Location = locationField;
})();
