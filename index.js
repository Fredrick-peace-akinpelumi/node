const express = require("express");
const bcrypt = require("bcrypt");
const detailsModel = require("./Model");
const usersModel = require("./Usermodel");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(express.json());
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true, limit: "300mb" }));
app.use(cors());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGOURL, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Mongo");
  }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log("App is listening at port " + PORT);
});

app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    usersModel
      .findOne({ email: req.body.email })
      .then(async (val) => {
        if (val) {
          res.send({ status: true, message: "Email already used" });
        } else {
          let hashPassword = await bcrypt.hash(req.body.password, 10);
          usersModel
            .create({ ...req.body, password: hashPassword })
            .then((value) => {
              res.send({message:"Saved successfully", user:value._id, status:true});
            })
            .catch((err) => {
              res.send({ status: false, message: "Something went wrong" });
            });
        }
      })
      .catch((err) => {
        res.send({ status: false, message: "Something went wrong" });
      });
  } catch (e) {
    next(e);
  }
});

app.post("/login", (req, res, next) => {
  try {
    usersModel.findOne({ email: req.body.loginemail }, async (err, result) => {
      if (err) {
        res.send({ status: false, message: "Something went wrong" });
      } else {
        if (result != null) {
          bcrypt
            .compare(req.body.loginpassword, result.password)
            .then((same) => {
              if (same) {
                res.send({
                  status: true,
                  user: result._id,
                  message: "Logged in successfully",
                });
              } else {
                res.send({ status: false, message: "Password not correct " });
              }
            });
        } else {
          res.json({ status: false, message: "Email or password incorrect" });
        }
      }
    });
  } catch (err) {
    next(ex);
  }
});

app.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    let form = new detailsModel(req.body);
    form.save((err) => {
      if (err) {
        res.send({ message: "Not saved", status: false });
      } else {
        res.send({
          message: "E don gree save",
          status: true,
        });
      }
    });
  } catch (e) {
    next(e);
  }
});
app.get("/", async (req, res, next) => {
  try {
      detailsModel.findOne({userId:req.body.id}).then((result) => {
        res.send({
          status: true,
          value:result
        })
      }).catch((err) => {
        res.send({
          message: "failed to fetch details",
          status: false,
        });
      })
  } catch (e) {
    next(e);
  }
});
