import "./css/styles.css";

import tt from "@tomtom-international/web-sdk-maps"
import tt_services from "@tomtom-international/web-sdk-services"
import toxicStyle from "./js/toxic";
import ipLocation from "./js/ipLocation";
import jsLocation from "./js/jsLocation";
import jsWatchLocation from "./js/jsWatchLocation";
import gatineauHydrantsLocation from "./js/gatineauHydrantsLocation";

import templateRoot from './hbs/root.hbs';
import templateMap from './hbs/map.hbs';
import L from 'leaflet';

// use root template, apply to "app" div
let appEl = document.getElementById("app");
let mainEl;
appEl.innerHTML = templateRoot({ siteInfo: { title: "Map" } });
let hydrantsMarkers = [];
let origen = [];
let destino = [];

window.onload = () => {
	mainEl = document.getElementById("main");
	mainEl.innerHTML = templateMap({});

	initMap();


	gatineauHydrantsLocation().then((posList) => {
		let selectBox = document.getElementById("places");
		hydrantsMarkers = []; // reset the hydrantsMarkers into a blank array
		let i = 0;
		for (let pos of posList) {
			let hlMarker = new tt.Marker().setLngLat([pos.lng, pos.lat]).addTo(map);
			hlMarker.getElement().addEventListener('click', function (e) {
				map.easeTo({ center: hlMarker.getLngLat(), zoom: 14, pitch: 45, bearing: 45, duration: 2000 });
				e.stopPropagation();
			});
			hydrantsMarkers[i] = hlMarker;
			let opt = document.createElement("option");
			opt.value = i; // set the order number of options to 'i' which represented the order num of the array order
			opt.text = pos.spec;

			selectBox.add(opt);
			i++;
		};
		selectBox.addEventListener('change', function (e) {
			//map.easeTo({
			//	center: hydrantsMarkers[selectBox.selectedIndex].getLngLat(),
			//	zoom: 18, pitch: 45, bearing: 45, duration: 2000
			//});
			destino = hydrantsMarkers[selectBox.selectedIndex].getLngLat();
			getRoute(origen, destino);
		});
	});

	ipLocation().then((location) => {
		console.log(`ip location is: ${location}`);
		origen = location;
		console.log(`set origen to: ${origen}`);
		// jsWatchLocation((pos) => {
		// let jsMarker = new tt.Marker().setLngLat([pos.longitude, pos.latitude]).addTo(map);
		// 	// console.log(pos);
		// });


		jsLocation((pos) => {
			let jsMarker = new tt.Marker().setLngLat([pos.longitude, pos.latitude]).addTo(map);

		});

		let marker = new tt.Marker().setLngLat([location.lng, location.lat]).addTo(map);
		marker.getElement().addEventListener('click', function (e) {
			map.easeTo({ center: marker.getLngLat(), zoom: 14, pitch: 45, bearing: 45, duration: 2000 });
			e.stopPropagation();
		});

		// document.getElementById("map").addEventListener('click', function () {
		// 	map.easeTo({ center: marker.getLngLat(), zoom: 12, pitch: 10, bearing: 0, duration: 2000 });
		// });



		// map.setBearing(0);

		// var marker = new tt.Marker().setLngLat([-75.737609, 45.455313]).addTo(map);


		var popup = new tt.Popup({ className: 'popup' })
			.setHTML("<h1>Hello I'm a Popup!</h1>")
			.addTo(map);

		// marker.setPopup(popup);
		// marker.getElement().addEventListener("click", function () {
		// 	console.log("marker clicked");
		// });


	});
};

let map;
let apiKey = "cJkjyEU1VAgU9UWuw9kSwdoJuBf4EMWc";
let initMap = () => {
	tt.setProductInfo("test-demo", "0.0.1");
	map = tt.map({
		key: apiKey,
		container: "map",
		style: toxicStyle,
		center: [-75.737609, 45.455313],
		zoom: 12,
		pitch: 10
	});
};

let getRoute = (origen, destino) => {
	// Agregar el control de ruta al mapa
	console.log(`origen: ${origen}`);
	console.log(`destino: ${destino}`);

	// Calcular la ruta
	tt_services.services.calculateRoute({
		key: apiKey,
		locations: `${origen.lng},${origen.lat}:${destino.lng},${destino.lat}`,
		travelMode: 'car',
		routeType: 'fastest',
		language: 'es-ES'
	}).then(routeData => {
		var geojson = routeData.toGeoJson();
		map.addLayer({
			'id': 'route',
			'type': 'line',
			'source': {
				'type': 'geojson',
				'data': geojson
			},
			'paint': {
				'line-color': '#0000FF',
				'line-width': 6
			}
		});

		var bounds = new tt.LngLatBounds();
		geojson.features[0].geometry.coordinates.forEach(function (point) {
			bounds.extend(tt.LngLat.convert(point));
		});
		map.fitBounds(bounds, { duration: 0, padding: 50 });

		// Obtener información de la ruta
		// const duracion = geojson.summary.travelTimeInSeconds / 60;  // Duración en minutos
		// const distancia = geojson.summary.lengthInMeters / 1000;  // Distancia en kilómetros

		console.log(`La ruta: ${geojson} json`);
		// console.log(`Duración de la ruta: ${duracion} minutos`);
		// console.log(`Distancia de la ruta: ${distancia} kilómetros`);
	}).catch(error => {
		console.error('Error al calcular la ruta:', error);
	});
};