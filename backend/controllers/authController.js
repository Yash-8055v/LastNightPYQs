import jwt from "jsonwebtoken";

export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_NAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    return res.json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};
