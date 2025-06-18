
import express from "express";
import db from "../db.js";
const router = express.Router();

// POST /api/auth/signup
// Body: { user_id, fName, lName, email, password, photo, birthdate, role, gender, phone }
router.post("/signup", async (req, res) => {
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
    const exists = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const result = await db.query(
    `INSERT INTO "User" (
        "user_id", "fName", "lName", "email", "password",
        "photo", "birthdate", "role", "gender", "phone"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [user_id, fName, lName, email, password, photo, birthdate, role, gender, phone]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


// POST /api/auth/login
// Body: { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM "User" WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;