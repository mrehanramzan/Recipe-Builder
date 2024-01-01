// Middleware to verify JWT token
import jwt from 'jsonwebtoken'
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
    }
   
    jwt.verify(token, process.env.secretKey , (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
}
export default verifyToken;