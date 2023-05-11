
const router = require('express').Router();
const axios = require('axios');
const cors = require('cors');
const { map } = require('../app');

router.use(cors());

/* GET home page. */
router.get('/', async function (req, res, next) {
    // https://api.ipgeolocation.io/ipgeo?apiKey=d64aa29252fe4a60b04461f4b28adbab&ip=
    // let remote = req.socket.remoteAddress;
    let remote = "74.14.208.182";
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=740cdb97d17344a8bc61d12d3fa2229c&ip=${remote}`;
    let fetch = await axios.get(url);

    let lat = fetch.data.latitude;
    let lng = fetch.data.longitude;
    // console.log(fetch.data);
    res.json({ lat: lat, lng: lng });
});

/* GET home page. */
router.get('/hydrants', async function (req, res, next) {

    //let url = `https://www.gatineau.ca/upload/donneesouvertes/BORNE_FONTAINE.json`;
    let url = `https://www.gatineau.ca/upload/donneesouvertes/LIEU_PUBLIC.json`;
    let fetch = await axios.get(url);
    let mapData = fetch.data.features;
    let outData = [];
    let outCount = mapData.length > 20 ? 20 : mapData.length;

    for (let i = 0; i < outCount; i++) {
        let rnd = Math.floor(Math.random() * mapData.length);
        let out = {
            "lat": mapData[rnd].geometry.coordinates[1],
            "lng": mapData[rnd].geometry.coordinates[0],
            "setId": i,
            "spec": mapData[rnd].properties.NOM_TOPOGR
        };
        outData.push(out);
    }
    res.json(outData);
});




module.exports = router;