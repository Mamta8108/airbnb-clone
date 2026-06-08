console.log("map div =", document.getElementById("map"));
console.log(window.mapToken);

maptilersdk.config.apiKey = window.mapToken;

const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: [77.1025, 28.7041],
    zoom: 10
});