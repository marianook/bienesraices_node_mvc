import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const { email, nombre, token } = datos;

  // Enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en bienesraices.com",
    text: "Confirma tu cuenta en bienesraices.com",
    html: `
    <p>Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>
    <p>Tu cuenta ya está lista, solo debes confirmarla en el sigueinte enlace: 
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar-cuenta/${token}">Confirmar cuenta<a/></p>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    
    `,
  });
};

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const { email, nombre, token } = datos;

  // Enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Restablece tu clave en bienesraices.com",
    text: "Restablece tu clave en bienesraices.com",
    html: `
    <p>Hola ${nombre}, has solicitado restablecer tu clave en bienesraices.com</p>
    <p>Sigue el siguiente enlace para generar un password nuevo: 
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/olvide-password/${token}">Reestablecer password<a/></p>

    <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
    
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
