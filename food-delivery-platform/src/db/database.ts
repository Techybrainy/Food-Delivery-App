import Database from 'better-sqlite3';

const db = new Database('sqlite.db', { verbose: console.log });

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      location TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      total REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    );
  `);

  // Seed data if empty
  const isRestaurantsEmpty = db.prepare('SELECT COUNT(*) as count FROM restaurants').get() as { count: number };
  if (isRestaurantsEmpty.count === 0) {
    console.log("Seeding initial database...");
    db.prepare('INSERT INTO restaurants (name, description, location, image_url) VALUES (?, ?, ?, ?)').run(
      'Burger Palace', 'Delicious artisan burgers, fries, and shakes', 'Downtown', 'https://picsum.photos/seed/burger/400/300'
    );
    db.prepare('INSERT INTO restaurants (name, description, location, image_url) VALUES (?, ?, ?, ?)').run(
      'Sushi Master', 'Authentic Japanese sushi and sashimi', 'Uptown', 'https://picsum.photos/seed/sushi/400/300'
    );
    db.prepare('INSERT INTO restaurants (name, description, location, image_url) VALUES (?, ?, ?, ?)').run(
      'Pizza Heaven', 'Wood-fired oven pizza with organic ingredients', 'Midtown', 'https://picsum.photos/seed/pizza/400/300'
    );

    const r1 = db.prepare('SELECT id FROM restaurants WHERE name = ?').get('Burger Palace') as { id: number };
    const r2 = db.prepare('SELECT id FROM restaurants WHERE name = ?').get('Sushi Master') as { id: number };
    const r3 = db.prepare('SELECT id FROM restaurants WHERE name = ?').get('Pizza Heaven') as { id: number };

    db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)').run(r1.id, 'Classic Cheeseburger', 'Angus beef with cheddar', 12.99);
    db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)').run(r1.id, 'Truffle Fries', 'Crispy fries with truffle oil', 6.99);

    db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)').run(r2.id, 'Salmon Roll', 'Fresh salmon with avocado', 14.50);
    db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)').run(r2.id, 'Miso Soup', 'Traditional hot miso soup', 4.00);

    db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)').run(r3.id, 'Margherita Pizza', 'Tomato, mozzarella, fresh basil', 16.00);
    db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (?, ?, ?, ?)').run(r3.id, 'Pepperoni Pizza', 'Double pepperoni and cheese', 18.00);
  }
};

export { db };
export default initDb;
