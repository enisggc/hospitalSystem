import pool from "../config/database.js";
import bcrypt from "bcryptjs";


export const createUser = async (name, email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, email, hashedPassword];
  
    const result = await pool.query(query, values);
    return result.rows[0];

}

export const findUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
  
    return result.rows.length ? result.rows[0] : null;
  };


  export const findUserById = async (id) => {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
  
    return result.rows.length ? result.rows[0] : null;
  };