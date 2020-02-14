var $loading = $('#view-file-loading');

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

var feature_layer = stations;
var current_layer;

var map = new ol.Map({
	target: 'showMapView',
	layers: [base_layer, canal_doble, cienaga, drenaje_doble, embalse, stations],
	view: new ol.View({
		center: ol.proj.fromLonLat([-74.08083,4.598889]),
		zoom: 5
	})
});

function get_realTimeObsDataH (stationcode, stationname) {
	$('#realTimeObsDataH-loading').removeClass('hidden');
    $.ajax({
        url: 'get-realTimeObsDataH',
        type: 'GET',
        data: {'stationcode' : stationcode, 'stationname': stationname},
        error: function () {
            $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            $('#info').removeClass('hidden');

            setTimeout(function () {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function (data) {
            if (!data.error) {
                $('#realTimeObsDataH-loading').addClass('hidden');
                $('#dates').removeClass('hidden');
//                $('#obsdates').removeClass('hidden');
                $loading.addClass('hidden');
                $('#realTimeObsDataH-chart').removeClass('hidden');
                $('#realTimeObsDataH-chart').html(data);

                //resize main graph
                Plotly.Plots.resize($("#realTimeObsDataH-chart .js-plotly-plot")[0]);

                var params = {
                    stationcode: stationcode,
                    stationname: stationname,
                };

                $('#submit-download-realTimeObsDataH').attr({
                    target: '_blank',
                    href: 'download-realTimeObsDataH?' + jQuery.param(params)
                });

                 $('#download-realTimeObsDataH').removeClass('hidden');

            } else if (data.error) {
            	$('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the Data</strong></p>');
            	$('#info').removeClass('hidden');

            	setTimeout(function() {
            		$('#info').addClass('hidden')
                }, 5000);

            } else {
            	$('#info').html('<p><strong>An unexplainable error occurred.</strong></p>').removeClass('hidden');
            }
        }
    });
};

map.on('pointermove', function(evt) {
	if (evt.dragging) {
		return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	var hit = map.forEachLayerAtPixel(pixel, function(layer) {
		if (layer == feature_layer) {
			current_layer = layer;
			return true;
		}
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on('pointermove', function(evt) {
	if (evt.dragging) {
		return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	var hit = map.forEachLayerAtPixel(pixel, function(layer) {
		if (layer == feature_layer) {
			current_layer = layer;
			return true;
		}
	});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on("singleclick", function(evt) {

	if (map.getTargetElement().style.cursor == "pointer") {

		var view = map.getView();
		var viewResolution = view.getResolution();
		var wms_url = current_layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json' });

		if (wms_url) {

			$("#obsgraph").modal('show');
			$('#realTimeObsDataH-chart').addClass('hidden');
			$('#realTimeObsDataH-loading').removeClass('hidden');
			$("#station-info").empty()
			$('#download_realTimeObsH').addClass('hidden');

			$.ajax({
				type: "GET",
				url: wms_url,
				dataType: 'json',
				success: function (result) {
					stationcode = result["features"][0]["properties"]["id"];
					stationname = result["features"][0]["properties"]["nombre"];
					stationlongitude = result["features"][0]["properties"]["lng"];
					stationlatitude = result["features"][0]["properties"]["lat"];
					stream = result["features"][0]["properties"]["corriente"];
					$("#station-info").append('<h3 id="Station-Name-Tab">Estacion: '+ stationname
						+ '</h3><h5 id="Latitude">Latitud: '
						+ stationlatitude + '</h3><h5 id="Latitude">Longitud: '
						+ stationlongitude+ '</h5><h5>Rio o Corriente: '+ stream);
					get_realTimeObsDataH (stationcode, stationname)
				}
			});
		}
	};
});

function resize_graphs() {
    $("#realTimeObsDataH_tab_link").click(function() {
        Plotly.Plots.resize($("#realTimeObsDataH-chart .js-plotly-plot")[0]);
    });
};