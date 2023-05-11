

export default (callback) => {
    navigator.geolocation.watchPosition((pos) => {
        callback(pos.coords);
    });

    // navigator.geolocation.clearWatch(1);
};