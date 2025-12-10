const db = require('../db/db');
const userModel = require('../models/userModel');

async function getAllStaff(req, res) {
  try {
    const staff = await userModel.getAllStaff()
    res.json(staff);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
}

async function createStaff(req, res) {
  const { name, email, role } = req.body;
  try {
    const newMember = await userModel.createStaff(name, email, role)
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Failed to create new staff member'})
  }
}

async function updateStaff(req, res) {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updated = await userModel.updateStaff(id, name, email, role)
    if (!updated) {
        return res.status(404).json({ error: 'Staffr member not found'})
    } res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update staff member'})
    }
}

async function getMyProfile(req, res) {
  const userId = req.user.id;
  const profile = await userModel.getProfile(userId)
  res.json(profile);
}

async function updateMyProfile(req, res) {
  const userId = req.user.id;
  const {name} = req.body;
  const updatedProfile = await userModel.updateProfile(userId, name)
  res.json(updatedProfile);
}

async function changeMyPassword(req, res) {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  const success = await userModel.changeMyPassword(userId, currentPassword, newPassword)
    if(!success) {
      return res.status(401).json({ error:'Current password incorrect'})
    } else {
        res.json({ message: 'Password updated successfully' });
    }
}

async function deleteStaff(req, res) {
  const { id } = req.params;
  try {
    const removed = await userModel.deleteStaff(id);
    if (!removed) return res.status(404).json({error: 'Staff member not found'});
    res.json({ message: 'User deleted', removed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
}

module.exports = { 
    getAllStaff, 
    createStaff, 
    updateStaff, 
    getMyProfile, 
    updateMyProfile, 
    changeMyPassword,
    deleteStaff
};
