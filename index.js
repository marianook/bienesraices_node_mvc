import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Habilitar lectura de datos de formulario
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexión a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Conexión correcta a la base de datos.");
} catch (error) {
  console.log(error);
}

// Habilitar PUG
app.set("view engine", "pug");
app.set("views", "./views"); // Seteamos la carpeta views y los archivos

// Carpeta Pública
app.use(express.static("public"));

// Routing
app.use("/", appRoutes);
app.use("/auth", usuarioRoutes); // use: toma todo aquello después de '/'
app.use("/", propiedadesRoutes);
app.use("/api", apiRoutes);

// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
});
