import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  try {
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
      from: "noreply@devmarianohayward.com",
      to: email,
      subject: "Confirma tu cuenta en Bienes Raíces",
      text: "Confirma tu cuenta en bienesraices.com",
      html: `
        <p>Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta<a/></p>

        <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
    });
    // :${process.env.PORT ?? 3000}
    console.log("Correo electrónico enviado con éxito.");
  } catch (error) {
    console.error("Error al enviar el correo:", error.message);
  }
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
    from: "noreply@devmarianohayward.com",
    to: email,
    subject: "Restablece tu clave en Bienes Raíces",
    text: "Restablece tu clave en bienesraices.com",
    html: `
    <p>Hola ${nombre}, has solicitado restablecer tu clave en bienesraices.com</p>
    <p>Sigue el siguiente enlace para generar un password nuevo: 
    <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Reestablecer password<a/></p>

    <p>Si tú no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
    
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
