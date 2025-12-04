const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // find user
    const user = await userModel.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // if password is null, user must set it first
    if (!user.password) {
      await userModel.setPassword(user.id, password);
    } else {
        // compare passwords
       const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({message: 'Server error during login' })
  }
}

module.exports = { login };
