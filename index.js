const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const brcypt = require("bcryptjs"); //?
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const imageDowloader = require("image-downloader");

const bcryptSalt = brcypt.genSaltSync(10);
const jwtSecret = "iuy34iy4uy2iu3y5i4657i5u23u";

dotenv.config();

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(
  cors({
    credential: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URI);

app.get("/test", (req, res, next) => {
  res.json("test ok");
});

// create register CURD-C
app.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: brcypt.hash(password, bcryptSalt),
    });

    res.json(userDoc);
  } catch (error) {
    res.status(422).json(e);
  }
});

//create login
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const pass = brcypt.compare(password, userDoc.password);
    if (pass) {
      jwt.sign({ email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(userDoc);
        }
      ); // doi chieu du lieu
      res.cookie("token", "").json("pass ok");
    } else {
      res.status(422).json("pass mot ok");
    }
  } else {
    res.json("not found");
  }
});

//profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (error, userData) => {
      if (error) throw error;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, id });
    });
  } else {
    res.json(null);
  }
});
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// upload link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  await imageDowloader.image({
    url: link,
    dest: __dirname + "/uploads" + newName,
  });
  res.json(newName);
});

app.listen(4000);
