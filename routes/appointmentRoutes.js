import express from "express";
import { createAppointment, deleteAppointment } from "../models/appointment.js";

const router = express.Router();


router.post("/create", async (req, res) => {
    console.log("Gelen Veri:", req.body); // Debugging için
    const { doktorId, tarih } = req.body;

    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login");
    }

    try {
        const yeniRandevu = await createAppointment(req.user.id, doktorId, tarih);
        console.log("Randevu başarıyla kaydedildi!" , yeniRandevu    );
        res.redirect("/dashboard");
    } catch (err) {
        console.error("Hata:", err);
        res.status(500).send("Randevu oluşturulamadı.");
    }
});



router.post("/delete/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  try {
    await deleteAppointment(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Randevu silinemedi.");
  }
});

export default router;
