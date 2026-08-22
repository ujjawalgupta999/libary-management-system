const jwt = require('jsonwebtoken');

// Verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Contains id and role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user role is authorized for the endpoint
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied: Role '${req.user.role}' is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { auth, authorize };