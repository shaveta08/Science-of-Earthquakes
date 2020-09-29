// All Earthquakes for past 7 days.
var baseUrl =
	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var Coords = [40.73, -74.0059];
var mapZoomLevel = 2.5;
var myMap, light, baseMaps;
// Markers for the cluster Layer
var markers = L.markerClusterGroup();
// Create the createMap function

function createMap(
	earthquakeLayer,
	legendLayer,
	platesLayer,
	heatLayer,
	markers
) {
	// Create the tile layer that will be the background of our map
	light = L.tileLayer(
		"https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: "light-v10",
			accessToken: API_KEY,
		}
	);
	grayscale = L.tileLayer.grayscale(
		"https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: "light-v10",
			accessToken: API_KEY,
		}
	);
	googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		subdomains: ["mt0", "mt1", "mt2", "mt3"],
	});

	// Create a baseMaps object to hold the lightmap layer
	baseMaps = {
		Light: light,
		GrayScale: grayscale,
		Satellite: googleSat,
	};
	// Create an overlayMaps object to hold the bikeStations layer
	var overlayMaps = {
		EarthQuake: earthquakeLayer,
		TectonicPlates: platesLayer,
		EarthquakesHeatLayer: heatLayer,
		ClusterLayer: markers,
	};
	// Create the map object with options
	myMap = L.map("map-id", {
		center: Coords,
		zoom: mapZoomLevel,
		timeDimension: true,
		timeDimensionControl: true,
		timeDimensionOptions: {
			// times: "2014-12-01T06:00:00Z,2014-12-01T09:00:00Z,2014-12-01T12:00:00Z,2014-12-01T15:00:00Z,2014-12-01T18:00:00Z,2014-12-01T21:00:00Z,2014-12-02T00:00:00Z,2014-12-02T03:00:00Z,2014-12-02T06:00:00Z,2014-12-02T09:00:00Z,2014-12-02T12:00:00Z,2014-12-02T15:00:00Z,2014-12-02T18:00:00Z,2014-12-02T21:00:00Z,2014-12-03T00:00:00Z,2014-12-03T03:00:00Z,2014-12-03T06:00:00Z,2014-12-03T09:00:00Z,2014-12-03T12:00:00Z,2014-12-03T15:00:00Z,2014-12-03T18:00:00Z,2014-12-03T21:00:00Z,2014-12-04T00:00:00Z,2014-12-04T03:00:00Z,2014-12-04T06:00:00Z,2014-12-04T12:00:00Z,2014-12-04T18:00:00Z,2014-12-05T00:00:00Z,2014-12-05T06:00:00Z,2014-12-05T12:00:00Z,2014-12-05T18:00:00Z,2014-12-06T00:00:00Z,2014-12-06T06:00:00Z,2014-12-06T12:00:00Z,2014-12-06T18:00:00Z,2014-12-07T00:00:00Z,2014-12-07T06:00:00Z,2014-12-07T12:00:00Z,2014-12-07T18:00:00Z,2014-12-08T00:00:00Z,2014-12-08T06:00:00Z,2014-12-08T12:00:00Z,2014-12-08T18:00:00Z,2014-12-09T00:00:00Z,2014-12-09T06:00:00Z,2014-12-09T12:00:00Z,2014-12-09T18:00:00Z,2014-12-10T00:00:00Z,2014-12-10T06:00:00Z"
		},
		layers: [light, earthquakeLayer],
	});
	legendLayer.addTo(myMap);

	// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
	L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

function chooseColor(depth) {
	if (depth > 90) return "#FF0000";
	else if (depth > 70) return "#FF4500";
	else if (depth > 50) return "#FFFF00";
	else if (depth > 30) return "#7FFF00";
	else if (depth > 10) return "#00FF00";
	else return "#008000";
}
function chooseRadius(mag) {
	mag = +mag;
	if (mag >= 8) return 40;
	else if (mag >= 7) return 35;
	else if (mag >= 6) return 30;
	else if (mag >= 5) return 25;
	else if (mag >= 4) return 20;
	else if (mag >= 3) return 15;
	else return 10;
}

function createLegend() {
	var legend = L.control({ position: "bottomright" });
	legend.onAdd = function () {
		var div = L.DomUtil.create("div", "info legend"),
			grades = [-10, 10, 30, 50, 70, 90],
			labels = [];
		for (var i = -0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' +
				chooseColor(grades[i] + 1) +
				'"></i>' +
				grades[i] +
				(grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br><hr>" : "+");
		}
		return div;
	};
	return legend;
}

function createHeatLayer(geoData) {
	var heatArray = [];

	for (var i = 0; i < geoData.features.length; i++) {
		var location = geoData.features[i].geometry;

		if (location) {
			heatArray.push([location.coordinates[1], location.coordinates[0]]);
		}
	}

	var heat = L.heatLayer(heatArray, {
		radius: 25,
		blur: 3,
		maxZoom: 100,
		gradient: { 0.25: "red", 0.5: "lime", 1: "yellow" },
	});
	return heat;
}

function createClusterLayer(geoData) {
	geoData.features.forEach((feature) => {
		// console.log(item);
		var location = feature.geometry.coordinates;
		var title = feature.properties.place;
		var marker = L.marker(new L.latLng(location[1], location[0]), {
			title: title,
		});
		marker.bindPopup(title);
		markers.addLayer(marker);
	});
}
// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(baseUrl, function (geoData) {
	d3.json("GeoJSON/PB2002_plates.json", function (bound) {
		console.log(geoData.features[0]);
		console.log(bound);
		var earthquakeLayer = L.geoJson(geoData, {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: chooseRadius(feature.properties.mag),
					//radius: 10,
					fillColor: chooseColor(feature.geometry.coordinates[2]),
					color: "white",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8,
				});
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup(
					"<h2>" +
						feature.properties.place +
						"<h2><hr><h3>Time: " +
						feature.properties.time +
						"</h3><br><h3>Magnitude: " +
						feature.properties.mag +
						"</h3><br><h3>Depth: " +
						feature.geometry.coordinates[2] +
						"</h3>"
				);
			},
		});
		var legendLayer = createLegend();

		var platesLayer = L.geoJSON(bound, {
			style: {
				color: "#7FFF00",
				fillColor: "pink",
				fillOpacity: 0.5,
				weight: 1.5,
			},
		});

		var heatLayer = createHeatLayer(geoData);
		createClusterLayer(geoData);
		createMap(earthquakeLayer, legendLayer, platesLayer, heatLayer, markers);
	});
});
