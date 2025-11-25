const db = require('../db/db');
const bcrypt = require('bcrypt');
import bcrypt from "bcryptjs";

// get usaer by email
async function getUserByEmail(email) {
  const result = await db.query(
    `SELECT id, name, email, password, role
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}
// admin/owner creates staff members (users), but users create own passwords
async function createUser(name, email, role) {
  const result = await db.query(
    `INSERT INTO users (name, email, role)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role`,
    [name, email, role]
  );
  return result.rows[0]; 
}
// staff sets their password (it gets hashed) during their first login
async function setPassword(userId, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
        `UPDATE users 
        SET password = $1
        WHERE id = $2
        RETURNING id, name, email, role`,
        [hashedPassword, userId]
  );
  return result.rows[0];
}

module.exports = {
  getUserByEmail,
  createUser,
  setPassword
};
