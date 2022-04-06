const express = require("express");
const app = express();

// call model for member
const detail = require("../models/index").detail;

// // *** call auth ***
// // panggil fungsi auth -> validasi token
// const { auth } = require("./Auth/login");

// // fungsi auth dijadikan middleware
// app.use(auth);
// // ---------------------------------

// middleware for allow the request from body (agar bisa membaca data yg dibody)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// end-point akses data member dg method GET
app.get("/", async (req, res) => {
  detail
    .findAll({
      include: [{ all: true, nested: true }],
    })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

// end-point akses data member berdasarkan 'id_member' tertentu dg method GET
app.get("/:id_detail", async (req, res) => {
  detail
    .findOne({ where: { id_detail: req.params.id_detail } })
    .then((detail) => {
      res.json(detail);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

// end-point add new member
app.post("/", async (req, res) => {
  // tampung data request yg akan dimasukkan
  let newDetail = {
    id_paket: req.body.id_paket,
    id_transaksi: req.body.id_transaksi,
    qty_barang: req.body.qty_barang,
  };

  // execute insert new member
  detail
    .create(newDetail)
    .then((result) => {
      res.json({
        message: "Data Success",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

// end-point mengubah data member dg method PUT
app.put("/", async (req, res) => {
  // key yg menunjukkan data yg akan diubah
  let param = {
    id_detail: req.body.id_detail,
  };

  // tampung data request yg akan diubah
  let data = {
    id_paket: req.body.id_paket,
    id_transaksi: req.body.id_transaksi,
    qty_barang: req.body.qty_barang,
  };

  // execute update data
  detail
    .update(data, { where: param })
    .then((result) => {
      res.json({
        message: "Data Updated",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

// end-point menghapus data member berdasarkan 'id_member' dg method DELETE
app.delete("/:id_detail", async (req, res) => {
  // tampung data yg akan dihapus
  let param = {
    id_detail: req.params.id_detail,
  };

  // execute delete data
  detail
    .destroy({ where: param })
    .then((result) => {
      res.json({
        message: "Data Deleted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

module.exports = app;
