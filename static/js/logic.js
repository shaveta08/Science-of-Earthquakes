// All Earthquakes for past 7 days.
var baseUrl =
	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var Coords = [40.73, -74.0059];
var mapZoomLevel = 2.5;
var myMap, light, baseMaps;
// Create the createMap function

function createMap(earthquakeLayer, legendLayer, platesLayer, heatLayer) {
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
	};
	// Create the map object with options
	myMap = L.map("map-id", {
		center: Coords,
		zoom: mapZoomLevel,
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

		createMap(earthquakeLayer, legendLayer, platesLayer, heatLayer);
	});
});
