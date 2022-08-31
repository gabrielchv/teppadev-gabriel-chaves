"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv").config();
// Firebase
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(process.env.GOOGLE_AUTH || "{}")),
});
const db = firebase_admin_1.default.firestore();
// Express config
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/build")));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SECRET || "default-cookie",
    resave: false,
    saveUninitialized: true,
}));
// Get main react project
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/entrar", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/build", "index.html"));
});
app.get("/cadastrar", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/build", "index.html"));
});
// Create user in db
app.post("/api/registeruser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersRef = db.collection("users").doc(req.body.username);
        const response = yield usersRef.get();
        if (!response.data()) {
            const userJson = {
                username: req.body.username,
                password: req.body.password,
                session_id: "",
                notes: [],
            };
            db.collection("users").doc(req.body.username).set(userJson);
            console.log("Usuário criado");
            res.send({ status: true });
        }
        else {
            console.log("Usuário não foi criado");
            res.send({ status: false });
        }
    }
    catch (err) {
        console.log(err);
        res.send({ status: false });
    }
}));
// Read specific user in db
app.post("/api/loginuser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userRef = db.collection("users").doc(req.body.username);
        const response = yield userRef.get();
        if (response.data() == undefined)
            res.send({ status: false });
        if (((_a = response.data()) === null || _a === void 0 ? void 0 : _a.password) != req.body.password)
            res.send({ status: false });
        if (((_b = response.data()) === null || _b === void 0 ? void 0 : _b.password) == req.body.password) {
            // Deletar os session antigos
            const cookieUsersRef = yield db.collection("users").where("session_id", "==", req.sessionID).get();
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
    }
    catch (err) {
        console.log(err);
        res.send({ status: false });
    }
}));
app.get("/api/getnotes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    console.log(req.sessionID);
    const cookieUsersRef = yield db.collection("users").where("session_id", "==", req.sessionID).get();
    if (cookieUsersRef.size > 0) {
        try {
            let username = "";
            cookieUsersRef.forEach((doc) => {
                username = doc.data().username;
            });
            const userRef = db.collection("users").doc(username);
            const response = yield userRef.get();
            let notes = [];
            if (response.data()) {
                notes = (_c = response.data()) === null || _c === void 0 ? void 0 : _c.notes;
            }
            res.send({ status: true, notes: notes });
        }
        catch (err) {
            console.log(err);
            res.send({ status: false });
        }
    }
    else {
        res.send({ status: false });
    }
}));
app.post("/api/registernotes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieUsersRef = yield db.collection("users").where("session_id", "==", req.sessionID).get();
    if (cookieUsersRef.size > 0) {
        try {
            let username = "";
            cookieUsersRef.forEach((doc) => {
                username = doc.data().username;
            });
            const userRef = db.collection("users").doc(username);
            console.log(username);
            let tempNotes = [];
            req.body.notes.forEach((note) => {
                tempNotes.push({ title: note.title, description: note.description, color: note.color, id: note.id });
            });
            userRef.update({
                notes: tempNotes,
            });
            res.send({ status: true });
        }
        catch (err) {
            console.log(err);
            res.send({ status: false });
        }
    }
    else {
        res.send({ status: false });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("http://localhost:" + PORT + "/");
});
