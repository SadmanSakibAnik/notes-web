const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();

// const app = express();

const notesRoutes = require("./routes/notes");
// app.use("/notes", notesRoutes);
const authRoutes = require("./routes/auth");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use("/notes", notesRoutes);
app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
