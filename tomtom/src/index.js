import "./css/styles.css";

import tt from "@tomtom-international/web-sdk-maps"
import toxicStyle from "./js/toxic";
import ipLocation from "./js/ipLocation";
import jsLocation from "./js/jsLocation";
import jsWatchLocation from "./js/jsWatchLocation";
import gatineauHydrantsLocation from "./js/gatineauHydrantsLocation";

import templateRoot from './hbs/root.hbs';
import templateMap from './hbs/map.hbs';

// use root template, apply to "app" div
let appEl = document.getElementById("app");
let mainEl;
appEl.innerHTML = templateRoot({ siteInfo: { title: "Map" } });
let hydrantsMarkers = [];

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
			map.easeTo({
				center: hydrantsMarkers[selectBox.selectedIndex].getLngLat(),
				zoom: 18, pitch: 45, bearing: 45, duration: 2000
			});
		});
	});

	ipLocation().then((location) => {

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
let initMap = () => {
	tt.setProductInfo("test-demo", "0.0.1");
	map = tt.map({
		key: "cJkjyEU1VAgU9UWuw9kSwdoJuBf4EMWc",
		container: "map",
		style: toxicStyle,
		center: [-75.737609, 45.455313],
		zoom: 12,
		pitch: 10
	});


};