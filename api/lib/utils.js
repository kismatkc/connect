import jwt from "jsonwebtoken";
export const corsOptions = () => ({
  origin: [
    "http://localhost:3000",
    "https://96283587-40ff-470f-a4ea-4f30bdcaad52-00-care00ttvfz8.spock.replit.dev",
    "https://connectfrontend.unfiltereddopamine.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"],
});
export const generateToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const allowAccess = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "You dont have enough permisson to visit this resources",
    });
    console.log(error);
  }
};
export function getAfterKeywordText(string, keyword) {
  if (!(string || keyword)) return null;
  const desiredStringLength = string.indexOf(keyword) + keyword.length;
  const desiredString = string.slice(desiredStringLength);
  return desiredString;
}
