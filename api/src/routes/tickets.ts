import { Router, type Request, type Response } from "express";
import { Ticket } from "../models/Ticket.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

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
// Create a ticket (any logged-in user)
// --------------------
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ error: "title and description required" });

    const ticket = await Ticket.create({
      title,
      description,
      status: "open",
      createdBy: req.user?._id,
    });

    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({ error: "failed_to_create_ticket" });
  }
});

// --------------------
// Get all tickets
// --------------------
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    let tickets;
    if (req.user?.role === "admin" || req.user?.role === "agent") {
      tickets = await Ticket.find({}).populate("createdBy", "name email").populate("assignedTo", "name email");
    } else {
      tickets = await Ticket.find({ createdBy: req.user?._id }).populate("assignedTo", "name email");
    }

    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({ error: "failed_to_fetch_tickets" });
  }
});

// --------------------
// Update ticket status (admin/agent only)
// --------------------
router.put("/:id", requireAuth, requireRole("admin", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "ticket not found" });

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    await ticket.save();
    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({ error: "failed_to_update_ticket" });
  }
});

// --------------------
// Delete a ticket (admin only)
// --------------------
router.delete("/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res: Response) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: "ticket not found" });
    return res.status(200).json({ message: "ticket deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "failed_to_delete_ticket" });
  }
});

export default router;
