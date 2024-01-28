import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "Mariano",
    email: "mariano@mariano.com",
    confirmado: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default usuarios;
