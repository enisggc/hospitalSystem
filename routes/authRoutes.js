import express from "express";
import passport from "passport";
import { createUser, findUserByEmail } from "../models/user.js";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login", { pageTitle: "Giriş Yap" });
});


router.get("/register", (req, res) => {
    res.render("register", { pageTitle: "Kayıt Ol" });
});


router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Çıkış yaparken hata oluştu:", err);
            return res.redirect("/dashboard");  
        }
        req.session.destroy(() => {
            res.redirect("/auth/login"); 
        });
    });
});


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.send("Bu e-posta zaten kayıtlı.");
    }

    await createUser(name, email, password);
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.send("Kayıt sırasında hata oluştu.");
  }
});



router.post("/login", (req, res, next) => {
    console.log("Giriş yapma denendi:", req.body);
    
    passport.authenticate("local", (err, user, info) => {
        console.log("Passport authenticate çalıştı!");

        if (err) {
            console.error("🚨 Hata:", err);
            return next(err); 
        }
        if (!user) {
            console.log("Kullanıcı bulunamadı veya şifre yanlış.");
            req.flash("error", "E-posta veya şifre hatalı.");
            return res.redirect("/auth/login");
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error("Oturum açma hatası:", loginErr);
                req.flash("error", "Oturum açma hatası.");
                return res.redirect("/auth/login");
            }

            console.log("Giriş başarılı:", user.email);
            req.flash("success", "Başarıyla giriş yapıldı.");
            return res.redirect("/dashboard");
        });
    })(req, res, next); 
});



export default router;
