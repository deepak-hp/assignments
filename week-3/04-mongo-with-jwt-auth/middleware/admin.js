// Middleware for handling auth
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  let token = req.headers.authorization;
  console.log(token);
  if (token) {
    token = token.replace("Bearer ", "").trim();
    const decodedValue = jwt.verify(token, JWT_SECRET);
    if (decodedValue.username) {
      req.username = decodedValue.username;
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Your are not authenticated" });
    }
  } else {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }
}

module.exports = adminMiddleware;
