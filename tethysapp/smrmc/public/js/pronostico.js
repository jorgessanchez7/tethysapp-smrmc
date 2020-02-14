
var base_layer = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
		imagerySet: 'Road'
	})
});

var canal_doble = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys2.byu.edu/geoserver/Forecast_Colombia/wms',
		params: { 'LAYERS': 'Canal_Doble' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	}),
	opacity: 0.5
});

var cienaga = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys2.byu.edu/geoserver/Forecast_Colombia/wms',
		params: { 'LAYERS': 'Cienaga' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	}),
	opacity: 0.5
});

var drenaje_doble = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys2.byu.edu/geoserver/Forecast_Colombia/wms',
		params: { 'LAYERS': 'Drenaje_Doble' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	}),
	opacity: 0.5
});

var embalse = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys2.byu.edu/geoserver/Forecast_Colombia/wms',
		params: { 'LAYERS': 'Embalse' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	}),
	opacity: 0.5
});

var stations = new ol.layer.Image({
	source: new ol.source.ImageWMS({
		url: 'https://tethys2.byu.edu/geoserver/Forecast_Colombia/wms',
		params: { 'LAYERS': 'Stations_H' },
		serverType: 'geoserver',
		crossOrigin: 'Anonymous'
	})
});

var map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer, canal_doble, cienaga, drenaje_doble, embalse, stations],
	view: new ol.View({
		center: ol.proj.fromLonLat([-74.08083,4.598889]),
		zoom: 5
	})
});