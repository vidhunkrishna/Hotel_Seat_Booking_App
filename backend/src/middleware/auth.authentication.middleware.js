import jwt from "jsonwebtoken";

export const authmiddleware = (req, res, next) => {
  try {
    const autheader = req.headers.authorization;
    if (!autheader) {
      return res.status(401).json({
        message: "Authorization required",
      });
    }
    const token = autheader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Authorization required",
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
