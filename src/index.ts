import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
require("dotenv").config();

// Firebase
import admin from "firebase-admin";
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.GOOGLE_AUTH || "{}")
  ),
});
const db = admin.firestore();

// Express config
const app = express();
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET || "default-cookie",
    resave: false,
    saveUninitialized: true,
  })
);

// Get main react project
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/entrar", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/cadastrar", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Create user in db
app.post("/api/registeruser", async (req, res) => {
  try {
    const usersRef = db.collection("users").doc(req.body.username);
    const response = await usersRef.get();
    if (!response.data()) {
      const userJson = {
        username: req.body.username,
        password: req.body.password,
        session_id: "",
        notes: {},
      };
      db.collection("users").doc(req.body.username).set(userJson);
      console.log("Usuário criado");
      res.send({ status: true });
    } else {
      console.log("Usuário não foi criado");
      res.send({ status: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: false });
  }
});

// Read specific user in db
app.post("/api/loginuser", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.body.username);
    const response = await userRef.get();
    if (response.data() == undefined) res.send({ status: false });
    if (response.data()?.password != req.body.password)
      res.send({ status: false });
    if (response.data()?.password == req.body.password) {
      // Deletar os session antigos
      const cookieUsersRef = await db
        .collection("users")
        .where("session_id", "==", req.sessionID)
        .get();
      cookieUsersRef.forEach((doc) => {
        db.collection("users").doc(doc.data().username).update({
          session_id: "",
        });
      });

      // Adicionando session no user novo
      userRef.update({
        session_id: req.sessionID,
      });
      res.send({ status: true });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: false });
  }
});

app.post("/api/test", async (req, res) => {
  const userRef = db.collection("users").doc("gabrielchv");
  const response = await userRef.get();
  userRef.update({
    notes: {
      0: {
        name: "name",
        desc: "desc",
        type: 1,
      },
      1: {
        name: "testename",
        desc: "testedesc",
        type: 3,
      },
      2: {
        name: "fuckname",
        desc: "fuckdesc",
        type: 1,
      },
    },
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT + "/");
});
