import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signJwt } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Extend Request to include user from JWT
interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: "admin" | "agent" | "user";
    email: string;
    name: string;
  };
}

// --------------------
// Register
// --------------------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email, password required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: "email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash: hash,
      role: "user"
    });

    const token = signJwt({
      _id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: "register_failed" });
  }
});

// --------------------
// Reset Password
// --------------------
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ error: "email and newPassword required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "user not found" });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password_hash = hash;
    await user.save();

    return res.status(200).json({ message: "password reset successfully" });
  } catch (err) {
    return res.status(500).json({ error: "reset_failed" });
  }
});

// --------------------
// Login
// --------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "invalid credentials" });

    const token = signJwt({
      _id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: "login_failed" });
  }
});

// --------------------
// Protected Route
// --------------------
router.get("/protected", requireAuth, (req: AuthRequest, res: Response) => {
  return res.status(200).json({ message: "You have access", user: req.user });
});

export default router;
