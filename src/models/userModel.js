const db = require('../db/db');
const bcrypt = require('bcrypt');
require('dotenv').config();


async function createAdminIfNotExists() {
  const existing = await db.query(
    `SELECT id FROM users WHERE name = $1 AND role = $2`,
    ['Admin', true]
  );

  if (existing.rows.length === 0) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      ['Admin', 'admin@example.com', true, hashedPassword]
    );
    console.log('Admin user created:', result.rows[0]);
  } else {
    console.log('Admin user already exists - email: admin@example.com');
  }
}

// get user by email
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
// staff sets their password during their first login
async function setPassword(userId, password) {
  if (!password) throw new Error('Password required');
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
// get all staff members
async function getAllStaff() {
    const result = await db.query(
      'SELECT id, name, email, role FROM users'
    );
    return result.rows;
}
// create new staff member
async function createStaff(name, email, role) {
    const result = await db.query(
        `INSERT INTO users (name, email, role)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, role`,
        [name, email, role]
    )
    return result.rows[0];
}
// update staff memeber info
async function updateStaff(id, name, email, role) {
    const result = await db.query(
        `UPDATE users
         SET name = $1, email=$2, role=$3
         WHERE id=$4
         RETURNING id, name, email, role`,
        [name, email, role, id]
    )
    return result.rows[0];
}

// get your own profile info (visible on navbar -> avatar dropdown)
async function getProfile(userId) {
  const result = await db.query(
    'SELECT id, name, email, role FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}

// Update your profile info
async function updateProfile(userId, name) {
  const result = await db.query(
    `UPDATE users 
     SET name = $1 WHERE id = $2 RETURNING id, name, email, role`,
    [name, userId]
  );
  return result.rows[0];
}

// change your password
async function changeMyPassword(userId, currentPassword, newPassword) {

  const user = await db.query(
    'SELECT password FROM users WHERE id = $1', [userId]
  );
  const valid = await bcrypt.compare(currentPassword, user.rows[0].password);
  if(!valid) return false;

  const newHash = await bcrypt.hash(newPassword, 10);
  await db.query(
    'UPDATE users SET password = $1 WHERE id = $2', [newHash, userId]);
  return true;
}
// delete staff member
async function deleteStaff(id) {
  const result = await db.query(
    `DELETE FROM users WHERE id=$1 RETURNING id, name, email, role`,
    [id]
  );
  return result.rows[0]; 
}


module.exports = {
  createAdminIfNotExists,
  getUserByEmail,
  createUser,
  setPassword,
  getAllStaff,
  createStaff,
  updateStaff,
  getProfile,
  updateProfile,
  changeMyPassword,
  deleteStaff
};
