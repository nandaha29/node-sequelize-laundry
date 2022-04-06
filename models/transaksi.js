"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // menghubungkan transaksi -> member
      this.belongsTo(models.member, {
        foreignKey: "id_member",
        as: "member",
      });

      // menghubungkan transaksi -> outlet
      this.belongsTo(models.outlet, {
        foreignKey: "id_outlet",
        as: "outlet",
      });

      // menghubungkan transaksi -> detail
      this.hasMany(models.detail, {
        foreignKey: "id_transaksi",
        as: "detail",
      });

      // menghubungkan transaksi -> user
      this.belongsTo(models.user, {
        foreignKey: "id_user",
        as: "user",
      });
    }
  }
  transaksi.init(
    {
      id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_member: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_outlet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      tgl_nitip: DataTypes.DATE,
      tgl_ambil: DataTypes.DATE,
      status_barang: DataTypes.ENUM("baru", "proses", "selesai", "diambil"),
      status_pembayaran: DataTypes.ENUM("lunas", "hutang"),
    },
    {
      sequelize,
      modelName: "transaksi",
      tableName: "transaksi",
    }
  );
  return transaksi;
};
