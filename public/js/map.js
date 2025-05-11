
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: listing.geometry.coordinates, // Longitude, Latitude (India)
  zoom: 4,
});

//Creating Marker
const popup = new mapboxgl.Popup({ offset: 25 })
  .setHTML(`<h4>${listing.location}</h4><p>Exact Location Provided after Booking</p>`);

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup) 
  .addTo(map);
