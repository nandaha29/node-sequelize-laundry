const express = require("express");
const app = express();

const models = require("../models/index");

// call model for member
const transaksi = models.transaksi;
const detail = models.detail;
// const detail = require("../models/index").detail;

// // *** call auth ***
// // panggil fungsi auth -> validasi token
const { auth } = require("./Auth/login");

// // fungsi auth dijadikan middleware
app.use(auth);
// // ---------------------------------

// isi tanggal secara otomatis
let tanggal = new Date();
// const moment = require("moment");

// middleware for allow the request from body (agar bisa membaca data yg dibody)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// end-point akses data member dg method GET
app.get("/", async (req, res) => {
  transaksi
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
app.get("/:id_transaksi", async (req, res) => {
  transaksi
    .findOne({ where: { id_transaksi: req.params.id_transaksi } })
    .then((transaksi) => {
      res.json(transaksi);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

// end-point add new member
app.post("/", async (req, res) => {
  // //call id table
  // let param = { id_detail: req.body.id_detail };
  // let dataDetail = await detail.findOne({ where: param });

  // //proses hitung
  // // let total_bulan = Number(req.body.bulan_bayar) - Number(dataTagihan.bulan);
  // let total_bayar = Number(req.body.bulan_bayar) * Number(dataDetail.qty_barang);
  // let current = new Date().toISOString().split("T")[0];

  // tampung data request yg akan dimasukkan
  let newTransaksi = {
    id_member: req.body.id_member,
    id_outlet: req.body.id_outlet,
    id_user: req.body.id_user,
    tgl_nitip: tanggal,
    tgl_ambil: tanggal,
    status_barang: req.body.status_barang,
    status_pembayaran: req.body.status_pembayaran,
    // paket
    // qty
  };

  // //proses perubahan status tagihan
  // let idDetail = { id_detail: data.id_detail };
  // let status = { status: 1 };
  // detail.update(status, { where: idDetail });

  // execute insert new member
  transaksi
    .create(newTransaksi)
    .then((result) => {
      let datadetail = req.body.detail;
      let IDTransaksi = result.id_transaksi;

      for (let i = 0; i < datadetail.length; i++) {
        datadetail[i].id_transaksi = IDTransaksi;
      }
      detail
        .bulkCreate(datadetail)
        .then((result) => {
          return response.json({
            message: `Data transaksi berhasil ditambahkan`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });

      res.json({
        message: "Transaksi berhasil ditambahkan",
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
    id_transaksi: req.body.id_transaksi,
  };

  // tampung data request yg akan diubah
  let data = {
    id_member: req.body.id_member,
    id_outlet: req.body.id_outlet,
    id_user: req.body.id_user,
    tgl_nitip: tanggal,
    tgl_ambil: tanggal,
    status_barang: req.body.status_barang,
    status_pembayaran: req.body.status_pembayaran,
  };

  // execute update data
  transaksi
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

// // end-point mengubah data member dg method PUT
// app.put("/status/:id_transaksi", async (req, res) => {
//   // key yg menunjukkan data yg akan diubah
//   let param = {
//     id_transaksi: req.body.id_transaksi,
//   };

//   // tampung data request yg akan diubah
//   let data = {
//     status_barang: req.body.status_barang,
//     status_pembayaran: req.body.status_pembayaran,
//   };

//   // execute update data
//   transaksi
//     .update(data, { where: param })
//     .then((result) => {
//       res.json({
//         message: "Data Updated",
//         data: result,
//       });
//     })
//     .catch((error) => {
//       res.json({
//         message: error.message,
//       });
//     });
// });

// end-point menghapus data member berdasarkan 'id_member' dg method DELETE
app.delete("/:id_transaksi", async (req, res) => {
  // tampung data yg akan dihapus
  let param = {
    id_transaksi: req.params.id_transaksi,
  };

  // execute delete data
  transaksi
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
