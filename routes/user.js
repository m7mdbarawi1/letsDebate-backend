import express from 'express';
import pgclient from '../db.js';

const router = express.Router();

// GET all users
// http://localhost:3001/api/users
router.get("/", async (req, res) => {
  try {
    const result = await pgclient.query('SELECT * FROM "User" ORDER BY user_id');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET a specific user by ID
// http://localhost:3001/api/users/:id
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pgclient.query(
      'SELECT * FROM "User" WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new user
// http://localhost:3001/api/users
router.post("/", async (req, res) => {
  const {
    user_id,
    fName,
    lName,
    email,
    password,
    photo,
    birthdate,
    role,
    gender,
    phone
  } = req.body;

  try {
    const result = await pgclient.query(
      `INSERT INTO "User" (
        "user_id", "fName", "lName", "email", "password",
        "photo", "birthdate", "role", "gender", "phone"
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      ) RETURNING *`,
      [user_id, fName, lName, email, password, photo, birthdate, role, gender, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


// PUT (update) a user by ID
// http://localhost:3001/api/users/:id
router.put("/:id", async (req, res) => {
  const { fName, lName, email, password, photo, birthdate } = req.body;
  try {
    const result = await pgclient.query(
      `UPDATE "User" SET "fName" = $1, "lName" = $2, "email" = $3, "password" = $4, "photo" = $5, "birthdate" = $6 WHERE user_id = $7 RETURNING *`,
      [fName, lName, email, password, photo, birthdate, req.params.id]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE a user by ID
// http://localhost:3001/api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await pgclient.query(
      'DELETE FROM "User" WHERE user_id = $1 RETURNING *',
      [req.params.id]
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
