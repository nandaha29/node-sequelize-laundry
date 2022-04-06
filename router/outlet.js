const express = require("express");
const app = express();

// call model for member
const outlet = require("../models/index").outlet;

// *** call auth ***
// panggil fungsi auth -> validasi token
const { auth } = require("./Auth/login");

// fungsi auth dijadikan middleware
app.use(auth);
// ---------------------------------

// ---- Library untuk upload image ----
// multer -> untuk membaca data request dari form-data
const multer = require("multer");

// path -> untuk manage alamat direktori file
const path = require("path");

// fs -> untuk manage file
const fs = require("fs");

// config storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image/outlet");
  },
  filename: (req, file, cb) => {
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
// -------------------------------------

// middleware for allow the request from body (agar bisa membaca data yg dibody)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// end-point akses data member dg method GET
app.get("/", async (req, res) => {
  outlet
    .findAll({ include: ["transaksi"] })
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
app.get("/:id_outlet", async (req, res) => {
  outlet
    .findOne({ where: { id_outlet: req.params.id_outlet } })
    .then((outlet) => {
      res.json(outlet);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
});

// end-point add new member
app.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.json({
      message: "No uploaded file",
    });
  } else {
    // tampung data request yg akan dimasukkan
    let newOutlet = {
      domisili_outlet: req.body.domisili_outlet,
      nama_outlet: req.body.nama_outlet,
      telp: req.body.telp,
      alamat: req.body.alamat,
      image: req.file.filename,
    };

    // execute insert new member
    outlet
      .create(newOutlet)
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
  }
});

// end-point mengubah data member dg method PUT
app.put("/", upload.single("image"), async (req, res) => {
  // key yg menunjukkan data yg akan diubah
  let param = {
    id_outlet: req.body.id_outlet,
  };

  // tampung data request yg akan diubah
  let data = {
    domisili_outlet: req.body.domisili_outlet,
    nama_outlet: req.body.nama_outlet,
    telp: req.body.telp,
    alamat: req.body.alamat,
  };

  if (req.file) {
    // get data by id
    const row = await outlet.findOne({ where: param });
    let oldFileName = row.image;

    // delete old file
    let dir = path.join(__dirname, "../image/outlet", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    // set new filename
    data.image = req.file.filename;
  }

  // execute update data
  outlet
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
app.delete("/:id_outlet", async (req, res) => {
  try {
    // tampung data yg akan dihapus
    let param = {
      id_outlet: req.params.id_outlet,
    };

    let result = await outlet.findOne({ where: param });
    let oldFileName = result.image;

    // delete old file
    let dir = path.join(__dirname, "../image/outlet", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    // execute delete data
    outlet
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
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

module.exports = app;
