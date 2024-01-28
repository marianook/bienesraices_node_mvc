(function () {
  const lat = document.querySelector("#lat").value || -26.8304383;
  const lng = document.querySelector("#lng").value || -65.2063833;
  const mapa = L.map("mapa").setView([lat, lng], 16);
  let marker;

  // Utilizar Provider y GeoCoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // El pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  // Detectar el movimiento del pin
  marker.on("moveend", function (e) {
    marker = e.target;

    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    // Obtener la información de las calles al soltar el pin
    geocodeService
      .reverse()
      .latlng(posicion, 13) //posicion, zoom
      .run(function (error, resultado) {
        console.log(resultado);
        marker.bindPopup(resultado.address.LongLabel);

        // Llenar los campos
        document.querySelector(".calle").textContent =
          resultado?.address.Address ?? "";

        // Estos son para llenar los inputs ocultos y después guardarlos en la bd
        document.querySelector("#calle").value =
          resultado?.address.Address ?? "";

        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();
