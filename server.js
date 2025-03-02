import express from "express";
import flash from "express-flash";

import session from "express-session";
import passport from "./config/passport.js";
import pool from "./config/database.js";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

app.use(express.static(path.join(process.cwd(), "public")));


app.set("view engine", "ejs");
app.use(flash());
app.use("/", dashboardRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "gizliKelime", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



app.get("/", (req, res) => {
    res.redirect("/auth/login"); 
});



app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/appointment", appointmentRoutes);

pool
  .connect()
  .then(() => console.log("PostgreSQL bağlantısı başarılı"))
  .catch((err) => console.log("Bağlantı hatası:", err));

  const PORT = 5001;
  app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));