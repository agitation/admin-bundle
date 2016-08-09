ag.ns("ag.admin.field");

(function(){
    var
        defaultLonLat = [10, 51],

        locationField = function()
        {
            var
                $map = new ag.ui.elem.Map(),
                $marker = ag.ui.tool.tpl("agitadmin-location-field", ".location-marker");

            this.extend(this, ag.ui.tool.tpl("agitadmin-location-field", ".location-field")).prepend($map);

            this.map = $map.ol;

            this.marker = new ol.Overlay({
                element: $marker[0],
                positioning: "bottom-center",
                stopEvent: false
            });

            this.currentLocation = null;

            this.map.addOverlay(this.marker);

            this.map.on("click", ev => {
                var location = ol.proj.transform(ev.coordinate, "EPSG:3857", "EPSG:4326");
                this.currentLocation = { lon : location[0], lat : location[1] };
                this.marker.setPosition(ev.coordinate);
            });
        };

    locationField.prototype = Object.create(ag.ui.field.ComplexField.prototype);

    locationField.prototype.setValue = function(value)
    {
        if (value instanceof Object && value.lon && value.lat)
        {
            var location = ol.proj.transform([value.lon, value.lat], "EPSG:4326", "EPSG:3857");

            this.marker.setPosition(location);
            this.map.getView().setCenter(location);
            this.map.getView().setZoom(15);
            this.currentLocation = value;
        }
        else
        {
            this.clear();
        }

        return this;
    };

    locationField.prototype.clear = function()
    {
        this.currentLocation = null;
        this.marker.setPosition(); // hide marker
        this.map.getView().setCenter(ol.proj.transform(defaultLonLat, "EPSG:4326", "EPSG:3857"));
        this.map.getView().setZoom(4);

        return this;
    };

    locationField.prototype.getValue = function()
    {
        if (!this.currentLocation)
            throw new ag.ui.error.FormError(ag.intl.t("Please select a location."));

        return new ag.api.Object("common.v1/Location", this.currentLocation);
    };

    ag.admin.field.Location = locationField;
})();
