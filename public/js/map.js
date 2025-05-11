mapboxgl.accessToken = mapToken;

// Only create map if geometry exists
if (listing.geometry && listing.geometry.coordinates) {
   
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: listing.geometry.coordinates,
    zoom: 4,
  });

  // Create popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location Provided after Booking</p>`);

  // Create marker
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
} else {
  console.log("Geometry exists", listing.geometry);
  console.warn("Map not initialized: Missing geometry data for this listing.");
}
