import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  // Validación
  await check("email")
    .isEmail()
    .withMessage("El Email es obligatorio.")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria.")
    .run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
    // Errores
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  // Comprobar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no existe" }],
    });
  }
  // Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Tu cuenta no ha sido confirmada" }],
    });
  }
  // Revisar un password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "La contraseña es incorrecta, intente nuevamente" }],
    });
  }
  // Autenticar al usuario
  const token = generarJWT(usuario.id);
  console.log(token);

  // Almacenar en un cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      // secure: true,
      // sameSite: true
    })
    .redirect("/mis-propiedades");
};

const cerrarSesion = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  // Validación
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("Debe colocar un email válido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La clave debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Las claves no coinciden")
    .run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
    // Errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Verificar que el usuario no esté duplicado en la bd
  const existeUsuario = await Usuario.findOne({
    where: { email: req.body.email },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  // Almacenar un usuario
  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password,
    token: generarId(),
  });

  // Envía email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });
  // Mostrar mensaje de confirmación
  res.render("templates/mensaje", {
    pagina: "Se creó su cuenta exitosamente",
    mensaje: "Enviamos un e-mail de confirmación, presiona en el enlace.",
  });
};

// Función que comprueba una cuenta
const confirmarCuenta = async (req, res) => {
  const { token } = req.params;

  // Verificar si el token es válido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo.",
      error: true,
    });
  }

  // Confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();
  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmada exitosamente",
    mensaje: "La cuenta se confirmó correctamente.",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    csrfToken: req.csrfToken(),
    pagina: "Recupera tu cuenta",
  });
};

const resetPassword = async (req, res) => {
  // Validación
  await check("email")
    .isEmail()
    .withMessage("Debe colocar un email válido")
    .run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado esté vacio
  if (!resultado.isEmpty()) {
    // Errores
    return res.render("auth/olvide-password", {
      csrfToken: req.csrfToken(),
      pagina: "Recupera tu cuenta",
      errores: resultado.array(),
    });
  }
  // Buscar usuario (en caso de que exista) -generamos nuevo token-
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  console.log(usuario);
  if (!usuario) {
    return res.render("auth/olvide-password", {
      csrfToken: req.csrfToken(),
      pagina: "Recupera tu cuenta",
      errores: [{ msg: "El Email no pertenece a ningún usuario." }],
    });
  }
  usuario.token = generarId();
  await usuario.save();

  // Enviar un email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  // Renderizar un mensaje
  res.render("templates/mensaje", {
    pagina: "Reestablece tu contraseña",
    mensaje: "Enviamos un e-mail con las instrucciones, presiona en el enlace.",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });
  console.log(usuario);
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu información.",
      error: true,
    });
  }
  // Mostrar un formulario para modificar el password
  res.render("auth/reset-password", {
    pagina: "Reestablece tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  // Validar password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La clave debe ser de al menos 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Errores
    return res.render("auth/reset-password", {
      pagina: "Reestablece tu contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  // Identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });
  console.log(usuario);

  // Hashear el password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();
  res.render("auth/confirmar-cuenta", {
    pagina: "Contraseña reestablecida",
    mensaje: "La contraseña se guardó correctamente.",
  });
};

export {
  formularioLogin,
  autenticar,
  cerrarSesion,
  formularioRegistro,
  registrar,
  confirmarCuenta,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
