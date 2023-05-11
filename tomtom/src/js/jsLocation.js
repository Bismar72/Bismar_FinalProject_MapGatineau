

export default (callback) => {

    navigator.geolocation.getCurrentPosition((pos) => {
        callback(pos.coords);
    });

};