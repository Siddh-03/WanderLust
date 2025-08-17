// In public/js/map.js

if (listingData && listingData.geometry && listingData.geometry.coordinates) {
  const coordinates = listingData.geometry.coordinates;

  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
    center: coordinates,
    zoom: 12,
  });

  // 1. Create a container element for the marker.
  const el = document.createElement("div");
  el.className = "marker-container";

  // 2. Create the pin image element (visible by default).
  const pin = document.createElement("img");
  pin.className = "marker-pin";
  pin.src =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/26px-Google_Maps_pin.svg.png";

  // 3. Create the circular icon element (hidden by default, shown on hover).
  const icon = document.createElement("span");
  icon.className = "marker-icon material-symbols-outlined";
  icon.innerText = "explore";

  // 4. Add both the pin and the icon to the container.
  el.appendChild(pin);
  el.appendChild(icon);

  // 5. Create the marker using the container element.
  new maplibregl.Marker({
    element: el,
    anchor: "bottom", // Important: keeps the pin's tip anchored correctly
  })
    .setLngLat(coordinates)
    .setPopup(
      new maplibregl.Popup({ offset: 25 }).setHTML(
        `<h5>${listingData.title}</h5><p>Exact location provided after booking.</p>`
      )
    )
    .addTo(map);
} else {
  console.error(
    "Coordinate data is missing for this listing. Cannot display map."
  );
}
