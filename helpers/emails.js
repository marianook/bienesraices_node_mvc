import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-sdk";

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  // Configurar el cliente de Brevo
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = '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'//process.env.BREVO_API_KEY; // Reemplaza con tu clave de API de Brevo
  const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

  // Crear un objeto de campaña de correo electrónico
  const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

  // Definir configuraciones de la campaña
  emailCampaigns.name = "Confirma tu cuenta en bienesraices.com";
  emailCampaigns.subject = "Confirma tu cuenta en bienesraices.com";
  emailCampaigns.sender = { name: nombre, email: email };
  emailCampaigns.type = "classic";

  // Contenido que se enviará
  (emailCampaigns.htmlContent = `
  <p>Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>
  <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: 
  <a href="${process.env.BACKEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta<a/></p>

  <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
  
  `),
    // Seleccionar los destinatarios
    (emailCampaigns.recipients = { listIds: [2, 7] });

  // Programar el envío en una hora
  emailCampaigns.scheduledAt = "2023-01-30 01:00:00"; // Ajusta la fecha y hora según tus necesidades

  try {
    // Realizar la llamada al cliente de Brevo
    const data = await apiInstance.createEmailCampaign(emailCampaigns);
    console.log("API llamada exitosamente. Datos devueltos:", data);
  } catch (error) {
    console.error(error);
  }
};

// const emailRegistro = async (datos) => {
//   const transport = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   const { email, nombre, token } = datos;

//   // Enviar el email
//   await transport.sendMail({
//     from: "BienesRaices.com",
//     to: email,
//     subject: "Confirma tu cuenta en bienesraices.com",
//     text: "Confirma tu cuenta en bienesraices.com",
//     html: `
//     <p>Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>
//     <p>Tu cuenta ya está lista, solo debes confirmarla en el sigueinte enlace:
//     <a href="${process.env.BACKEND_URL}:${
//       process.env.PORT ?? 3000
//     }/auth/confirmar-cuenta/${token}">Confirmar cuenta<a/></p>

//     <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>

//     `,
//   });
// };

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
