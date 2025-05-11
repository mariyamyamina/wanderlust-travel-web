mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: listing.geometry.coordinates,
    zoom: 8,
  });

  // Create popup
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location Provided after Booking</p>`);

  // Create marker
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);

