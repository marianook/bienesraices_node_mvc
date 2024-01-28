const esVendedor = (usuarioId, propiedadUsuarioId) => {
  return usuarioId === propiedadUsuarioId;
};

const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setUTCHours(12, 0, 0, 0); // Set time to 12:00:00.000 UTC

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(nuevaFecha).toLocaleDateString("es-ES", opciones);
};

export { esVendedor, formatearFecha };
