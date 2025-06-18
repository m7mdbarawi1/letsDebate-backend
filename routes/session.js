import express from "express";
import pgclient from "../db.js";

const router = express.Router();

// GET all sessions
// http://localhost:3001/api/sessions
router.get("/", async (req, res) => {
  try {
    const result = await pgclient.query('SELECT * FROM "Session" ORDER BY session_id');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// GET a specific session by ID
// http://localhost:3001/api/sessions/:id
router.get("/:id", async (req, res) => {
  const sessionId = req.params.id;
  try {
    const result = await pgclient.query(
      `SELECT * FROM "Session" WHERE session_id = $1`,
      [sessionId]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Session not found" });
  } catch (err) {
    console.error("Error fetching session by ID:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// POST a new session (all fields manual)
// http://localhost:3001/api/sessions
router.post("/", async (req, res) => {
  const {
    session_id,
    title,
    description,
    photo,
    date,
    category_id,
    price,
    address
  } = req.body;

  try {
    const result = await pgclient.query(
      `INSERT INTO "Session" (
        session_id, title, description, photo, date, category_id, price, address
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *`,
      [session_id, title, description, photo, date, category_id, price, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding session:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// PUT update session (manual)
// http://localhost:3001/api/sessions/:id
router.put("/:id", async (req, res) => {
  const {
    title,
    description,
    photo,
    date,
    category_id,
    price,
    address
  } = req.body;

  try {
    const result = await pgclient.query(
      `UPDATE "Session"
       SET title = $1,
           description = $2,
           photo = $3,
           date = $4,
           category_id = $5,
           price = $6,
           address = $7
       WHERE session_id = $8
       RETURNING *`,
      [title, description, photo, date, category_id, price, address, req.params.id]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Session not found" });
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// DELETE a session by ID
// http://localhost:3001/api/sessions/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await pgclient.query(
      `DELETE FROM "Session" WHERE session_id = $1 RETURNING *`,
      [req.params.id]
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Session not found" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
