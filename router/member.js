const express = require("express");
const app = express();

// call model for member
const member = require("../models/index").member;

// // *** call auth ***
// // panggil fungsi auth -> validasi token
const { auth } = require("./Auth/login");

// // fungsi auth dijadikan middleware
app.use(auth);
// // ---------------------------------

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
    cb(null, "./image/member");
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
  member
    .findAll()
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
app.get("/:id_member", async (req, res) => {
  member
    .findOne({ where: { id_member: req.params.id_member } })
    .then((member) => {
      res.json(member);
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
    let newMember = {
      nama_member: req.body.nama_member,
      alamat: req.body.alamat,
      telp: req.body.telp,
      image: req.file.filename,
    };

    // execute insert new member
    member
      .create(newMember)
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
    id_member: req.body.id_member,
  };

  // tampung data request yg akan diubah
  let data = {
    nama_member: req.body.nama_member,
    alamat: req.body.alamat,
    telp: req.body.telp,
  };

  if (req.file) {
    // get data by id
    const row = await member.findOne({ where: param });
    let oldFileName = row.image;

    // delete old file
    let dir = path.join(__dirname, "../image/member", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    // set new filename
    data.image = req.file.filename;
  }

  // execute update data
  member
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
app.delete("/:id_member", async (req, res) => {
  try {
    // tampung data yg akan dihapus
    let param = {
      id_member: req.params.id_member,
    };

    let result = await member.findOne({ where: param });
    let oldFileName = result.image;

    // delete old file
    let dir = path.join(__dirname, "../image/member", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    // execute delete data
    member
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

// FIND MEMBER
app.get("/cari", async (req, res) => {
  let keyword = request.body.keyword;

  let sequelize = require(`sequelize`);
  let Op = sequelize.Op;

  /** query = select * from siswa where nama like "%keyword%" or
   * kelas like "%keyword%" or nis like "%keyword%"
   *
   */
  let dataMember = await member.findAll({
    where: {
      [Op.or]: {
        nama_member: { [Op.like]: `%${keyword}%` },
        alamat: { [Op.like]: `%${keyword}%` },
      },
    },
  });

  return response.json(dataMember);
});

module.exports = app;
