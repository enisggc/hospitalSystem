import pool from "../config/database.js";

export const createAppointment = async (userId, doktorId, tarih) => {
    const query = `INSERT INTO randevular (user_id, doktor_id, tarih) VALUES ($1, $2, $3 ) RETURNING *`;
    const result = await pool.query(query, [userId, doktorId, tarih]);
  
    return result.rows[0];

};


export const getAppointmentsByUser = async (userId) => {
    const query = `
      SELECT randevular.id, doktorlar.name AS doktor_adi, randevular.tarih
      FROM randevular
      JOIN doktorlar ON randevular.doktor_id = doktorlar.id
      WHERE randevular.user_id = $1
      ORDER BY randevular.tarih ASC
    `;
    const result = await pool.query(query, [userId]);
    console.log("Kullanıcının DB'den çekilen randevuları:", result.rows); 

    return result.rows.map(apt => ({
        ...apt,
        tarih: new Date(apt.tarih).toISOString() 
    }));
  };
  


export const deleteAppointment = async (appointmentId) => {
    const query = "DELETE FROM randevular WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [appointmentId]);
  
    return result.rows[0];

};