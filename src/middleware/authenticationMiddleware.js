const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing token' });
  
  // header in format "Authorization: Bearer <token>"
  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded data if token is valid
    next(); // continue to next middleware/route
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid token' });
  }
}
function adminOnly(req, res, next) {
  // Admin on role === true
  if (req.user?.role !== true) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
}


module.exports = { authRequired, adminOnly };
