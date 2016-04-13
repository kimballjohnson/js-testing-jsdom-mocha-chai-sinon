var api = api || {};

api.Map = function(divId) {
    var map = new ol.Map({
        view: new ol.View({
            zoom: 5,
            center: [1139828, 6212801]
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({
                    layer: 'osm'
                })
            })
        ],
        target: divId
    });

    var centreTo = function(latLon) {
        map.getView().setCenter(ol.proj.fromLonLat([latLon.lon, latLon.lat]));
        map.getView().setZoom(9);
    };

    return {
        centreTo: centreTo
    };
};
