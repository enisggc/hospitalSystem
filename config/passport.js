import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import pool from "../config/database.js";
import bcrypt from "bcryptjs";


passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            console.log("LocalStrategy ÇALIŞTI!");
            console.log("Gelen email:", email);
            console.log("Gelen password:", password);

            try {
                const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

                if (userResult.rows.length === 0) {
                    console.log("Kullanıcı bulunamadı.");
                    return done(null, false, { message: "Kullanıcı bulunamadı." });
                }

                const user = userResult.rows[0];
                console.log("Kullanıcı bulundu:", user.email);
                console.log("Veritabanından gelen hashli şifre:", user.password);

                const isMatch = await bcrypt.compare(password, user.password);
                console.log("Şifre karşılaştırma sonucu:", isMatch);

                if (!isMatch) {
                    console.log("Yanlış şifre!");
                    return done(null, false, { message: "Yanlış şifre." });
                }

                console.log("Kullanıcı doğrulandı:", user.email);
                return done(null, user);
            } catch (error) {
                console.error("Authentication hatası:", error);
                return done(error);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    console.log("Kullanıcı serialize ediliyor:", user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("Kullanıcı deserialize ediliyor, ID:", id);
        const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (userResult.rows.length === 0) {
            return done(null, false);
        }
        done(null, userResult.rows[0]);
    } catch (error) {
        console.error("deserializeUser hatası:", error);
        done(error);
    }
});

export default passport;
