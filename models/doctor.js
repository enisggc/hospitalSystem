import pool from "../config/database.js";


export const getAllPoliklinikler = async () => {
    const query = "SELECT * FROM poliklinikler";
    const result = await pool.query(query);
  
    return result.rows;
  };

  export const getDoctorsByPoliklinik = async (poliklinikId) => {
    console.log("getDoctorsByPoliklinik çağrıldı, ID:", poliklinikId); 
    const query = `
        SELECT * FROM doktorlar
        WHERE poliklinik_id = $1
        ORDER BY id ASC;
    `;

    const result = await pool.query(query, [poliklinikId]);
    console.log("DB'den gelen doktorlar:", result.rows); 

    return result.rows;
};



  export const addDoctor = async (name, poliklinikId) => {
    const query = "INSERT INTO doktorlar (name, poliklinik_id) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [name, poliklinikId]);
  
    return result.rows[0];
  };