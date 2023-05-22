import prisma from "../db";
import { createJWT, hashPassword, comparePasswords, refreshJWT } from "../modules/auth";
import jwt from 'jsonwebtoken'

export const createNewUser = async (req, res,next) => {
  try {
     const user = await prisma.administratorUser.create({
    data: {
      name: req.body.name,
      password: await hashPassword(req.body.password),
    },
  }); 
  const token = createJWT(user);
  res.json({ token });
  } catch (error) {
    error.type = 'input'
    next(error)
  }


};

export const signIn = async (req, res) => {
  const user = await prisma.administratorUser.findUnique({
    where: {
      name: req.body.name,
    },
  });
  const isValid = await comparePasswords(req.body.password, user.password);
  if (!isValid) {
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }
  const token = createJWT(user);
  res.json({ token });
};
export const refreshToken = async (req, res) => {
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

    const newToken = refreshJWT(user);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401);
    res.json({ message: "Not Valid Token" });
    return;
  }
};
