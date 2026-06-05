import jwt  from "jsonwebtoken";

export default async (req, res, next) => {
  console.log("AUTH START");

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("NO TOKEN");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("TOKEN OK");

    req.user = decoded;

    next();
  } catch (err) {
    console.log("AUTH ERROR", err.message);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};