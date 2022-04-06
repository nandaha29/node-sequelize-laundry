"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // menghubungkan detail -> paket
      this.belongsTo(models.paket, {
        foreignKey: "id_paket",
        as: "paket",
      });
    }
  }
  detail.init(
    {
      id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_paket: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      qty_barang: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "detail",
      tableName: "detail",
    }
  );
  return detail;
};
