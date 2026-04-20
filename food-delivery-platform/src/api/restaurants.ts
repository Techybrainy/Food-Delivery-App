import { Router } from "express";
import { db } from "../db/database.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    const restaurants = db.prepare('SELECT * FROM restaurants').all();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const menuItems = db.prepare('SELECT * FROM menu_items WHERE restaurant_id = ?').all(id);
    res.json({ ...(restaurant as any), menu: menuItems });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant details" });
  }
});

export default router;
