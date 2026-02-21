import jwt from "jsonwebtoken";

// ==============================
// Protect Routes (Verify Token)
// ==============================
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data from token
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next();

    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  return res.status(401).json({
    message: "Not authorized, no token",
  });
};

// ==============================
// Role Based Authorization
// ==============================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' not authorized`,
      });
    }
    next();
  };
};