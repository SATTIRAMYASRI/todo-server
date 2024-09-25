const jwt = require("jsonwebtoken");
const JWT_SECRET = 'ramya_secretkey'; // Make sure this is secure in a real application

const authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    
    console.log(`testing ${token}`);
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(`testing ${err}`);
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }
  
        req.userId = decoded.id; // Save the user ID for use in protected routes
        next();
    });
};

module.exports = authenticate;
