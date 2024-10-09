import { sign } from "jsonwebtoken";

export const getToken = async (req, res) => {
  const token = await sign({ sub: req.params.id }, process.env.JWT_SECRET!);

  res.send({ token });
};
