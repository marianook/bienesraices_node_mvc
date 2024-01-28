import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING, // Cuando solo tiene 1 atributo podemos definirlos de esta manera
    confirmado: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      // Hashear password
      beforeCreate: async function (usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
    },
    scopes: {
      eliminarPassword: {
        attributes: {
          exclude: [
            "password",
            "token",
            "confirmado",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    },
  }
);

// Métodos personalizados
Usuario.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default Usuario;
