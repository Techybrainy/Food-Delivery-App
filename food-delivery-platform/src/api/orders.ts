import { Router } from "express";
import { db } from "../db/database.js";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET = process.env.JWT_SECRET || "super-secret-key-for-demo";

// Middleware to protect routes
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post("/", authenticateToken, (req: any, res: any) => {
  const { items, total } = req.body; // items: [{ id, quantity, price }]
  const userId = req.user.id;

  try {
    const createOrder = db.transaction((orderItems) => {
      const info = db.prepare('INSERT INTO orders (user_id, status, total) VALUES (?, ?, ?)').run(userId, 'Pending', total);
      const orderId = info.lastInsertRowid;

      const insertItem = db.prepare('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)');
      for (const item of orderItems) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
      }
      return orderId;
    });

    const orderId = createOrder(items);
    res.status(201).json({ id: orderId, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/", authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  try {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
