import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Set token expiration time as desired, e.g., 1 hour
  );
  return token;
};

export const refreshJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Set the same expiration time as the original token
  );
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401);
    res.json({ message: "Not Valid Token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    // Check if the token is about to expire (e.g., within 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = user.exp;
    const refreshThreshold = 300; // 5 minutes
    const shouldRefreshToken = expirationTime - now < refreshThreshold;

    if (shouldRefreshToken) {
      const newToken = refreshJWT(user);
      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    next();
  } catch (error) {
    res.status(401);
    res.json({ message: "Not Valid Token" });
    return;
  }
};
