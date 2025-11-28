const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function login(req, res) {
  const { email, password } = req.body;

  // find user
  const user = await userModel.getUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // compare passwords
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

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
}

module.exports = { login };
