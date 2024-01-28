import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js";

const importarDatos = async () => {
  try {
    // Autenticar en la bd
    await db.authenticate();

    // Generar las columnas antes de insertar
    await db.sync();

    // Insertamos los datos finalmente

    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
      Usuario.bulkCreate(usuarios),
    ]);

    console.log("Datos importados correctamente.");
    process.exit(0); // Cuando se le pasa 0 o vacío es porque finalizó correctamente
  } catch (error) {
    console.log(error);
    process.exit(1); // Una forma de terminar los procesos // Cuando se le pasa 1 es porque finalizó pero hay un error.
  }
};

const eliminarDatos = async () => {
  try {
    // await Promise.all([
    //   Categoria.destroy({ where: {}, truncate: true }),
    //   Precio.destroy({ where: {}, truncate: true }),
    // ]);
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
