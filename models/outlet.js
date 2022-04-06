"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class outlet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // buat realasi ke transaksi dulu nak

      this.hasMany(models.transaksi, {
        foreignKey: "id_outlet",
        as: `transaksi`,
      });
    }
  }
  outlet.init(
    {
      id_outlet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_outlet: DataTypes.STRING,
      telp: DataTypes.INTEGER,
      alamat: DataTypes.STRING,
      domisili_outlet: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "outlet",
      tableName: "outlet",
    }
  );
  return outlet;
};
