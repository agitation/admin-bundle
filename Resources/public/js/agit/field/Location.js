agit.ns("agit.field");

(function(){
    var locationField = function()
    {
        var
            $map = new agit.elem.Map(),
            $marker = agit.tool.tpl("agitadmin-location-field", ".location-marker");

        this.extend(this, agit.tool.tpl("agitadmin-location-field", ".location-field")).prepend($map);

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

    locationField.prototype = Object.create(agit.field.Field.prototype);

    locationField.prototype.setValue = function(value)
    {
        if (value instanceof Object)
        {
            var location = ol.proj.transform([value.lon, value.lat], "EPSG:4326", "EPSG:3857");

            this.marker.setPosition(location);
            this.map.getView().setCenter(location);
            this.map.getView().setZoom(15);

            this.currentLocation = value;
        }

        return this;
    };

    locationField.prototype.getValue = function()
    {
        if (!this.currentLocation)
            throw new agit.error.FormError(agit.intl.t("Please select a location."));

        return new agit.api.Object("common.v1/Location", this.currentLocation);
    };

    agit.field.Location = locationField;
})();
