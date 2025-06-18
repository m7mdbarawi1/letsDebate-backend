import express from "express";
import pgclient from "../db.js";

const router = express.Router();

// GET all reservations
// http://localhost:3001/api/reservations
router.get("/", async (req, res) => {
  try {
    const result = await pgclient.query('SELECT * FROM "reservation"');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// GET a specific reservation by user_id and session_id
// http://localhost:3001/api/reservations/:user_id/:session_id
router.get("/:user_id/:session_id", async (req, res) => {
  const { user_id, session_id } = req.params;
  try {
    const result = await pgclient.query(
      'SELECT * FROM "reservation" WHERE user_id = $1 AND session_id = $2',
      [user_id, session_id]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Reservation not found" });
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// POST create new reservation (manual)
// http://localhost:3001/api/reservations
// body: { "user_id": ..., "session_id": ... }
router.post("/", async (req, res) => {
  const { user_id, session_id } = req.body;
  try {
    const result = await pgclient.query(
      'INSERT INTO "reservation" (user_id, session_id) VALUES ($1, $2) RETURNING *',
      [user_id, session_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// DELETE reservation by user_id and session_id
// http://localhost:3001/api/reservations/:user_id/:session_id
router.delete("/:user_id/:session_id", async (req, res) => {
  const { user_id, session_id } = req.params;
  try {
    const result = await pgclient.query(
      'DELETE FROM "reservation" WHERE user_id = $1 AND session_id = $2 RETURNING *',
      [user_id, session_id]
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Reservation not found" });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
