const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/dataDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/data", function (req, res) {
  res.render("data");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dob: req.body.dob,
  });

  if (req.body.password === req.body.conpassword) {
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        User.find({}, function (err, foundUser) {
          res.render("data", {
            Users: foundUser,
          });
        });
      }
    });
  }
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          User.find({}, function (err, foundUser) {
            res.render("data", {
              Users: foundUser,
            });
          });
        }
      }
    }
  });
});

app.listen(5000, function () {
  console.log("Server has started at port 5000");
});
