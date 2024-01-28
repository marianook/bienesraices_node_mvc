import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

// Precio.hasOne(Propiedad); // Primer Método para relacionar de uno a uno
Propiedad.belongsTo(Precio, { foreignKey: "precioId" }); // Segundo método para relacionar de uno a uno
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId" });
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioId" });
Propiedad.hasMany(Mensaje, { foreignKey: "propiedadId" }); // 1 propiedad puede tener muchos mensajes

Mensaje.belongsTo(Propiedad, { foreignKey: "propiedadId" });
Mensaje.belongsTo(Usuario, { foreignKey: "usuarioId" });

export { Propiedad, Precio, Categoria, Usuario, Mensaje };
