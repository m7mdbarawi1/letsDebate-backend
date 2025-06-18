import express from "express";
import pgclient from "../db.js";

const router = express.Router();

// GET all categories
// http://localhost:3001/api/categories
router.get("/", async (req, res) => {
  try {
    const result = await pgclient.query('SELECT * FROM "Category" ORDER BY category_id');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// GET a category by ID
// http://localhost:3001/api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await pgclient.query(
      'SELECT * FROM "Category" WHERE category_id = $1',
      [req.params.id]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Category not found" });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// POST create new category (manual)
// http://localhost:3001/api/categories
router.post("/", async (req, res) => {
  const { category_id, categoryName } = req.body;

  try {
    const result = await pgclient.query(
      'INSERT INTO "Category" (category_id, "categoryName") VALUES ($1, $2) RETURNING *',
      [category_id, categoryName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// PUT update category name manually
// http://localhost:3001/api/categories/:id
router.put("/:id", async (req, res) => {
  const { categoryName } = req.body;

  try {
    const result = await pgclient.query(
      'UPDATE "Category" SET "categoryName" = $1 WHERE category_id = $2 RETURNING *',
      [categoryName, req.params.id]
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Category not found" });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// DELETE category by ID manually
// http://localhost:3001/api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await pgclient.query(
      'DELETE FROM "Category" WHERE category_id = $1 RETURNING *',
      [req.params.id]
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Category not found" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
