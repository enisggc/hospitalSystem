import express from "express";
import { getAllPoliklinikler, getDoctorsByPoliklinik } from "../models/doctor.js";
import { getAppointmentsByUser } from "../models/appointment.js";

const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login");
    }

    try {

        console.log("Dashboard yükleniyor, userId:", req.user.id);

        const poliklinikler = await getAllPoliklinikler();
        const appointments = await getAppointmentsByUser(req.user.id);

        console.log("Kullanıcının randevuları:", appointments);

        
        let doctors = [];
        if (poliklinikler.length > 0) {
            doctors = await getDoctorsByPoliklinik(poliklinikler[0].id);
        }

        console.log("Dashboard’a gönderilen appointments verisi:", appointments);


        res.render("dashboard", { 
            user: req.user, 
            pageTitle: "Dashboard", 
            poliklinikler, 
            appointments,
            doctors 
        });

    } catch (err) {
        console.error(err);
        res.send("Dashboard yüklenirken hata oluştu.");
    }
});


router.get("/doctors/:poliklinikId", async (req, res) => {
    try {
        console.log("İstek geldi, poliklinik ID:", req.params.poliklinikId);
        const doctors = await getDoctorsByPoliklinik(req.params.poliklinikId);
        console.log("Gelen doktorlar:", doctors);
        res.json(doctors);
    } catch (err) {
        console.error("Doktorları çekerken hata:", err);
        res.status(500).send("Doktorlar yüklenirken hata oluştu.");
    }
});



export default router;
