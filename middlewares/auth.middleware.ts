import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../prisma/client";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const splitted = authHeader.split(" ");

  if (splitted.length !== 2 || splitted[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = splitted[1];

  try {
    const { sub }: any = await verify(token, process.env.JWT_SECRET!);

    const user = await User.findUnique({
      where: {
        id: parseInt(sub),
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req["user"] = user;

    next();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
