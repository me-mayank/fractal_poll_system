import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.json({ success: true, token });
  }

  res.json({ success: false, message: "Invalid credentials" });
};
