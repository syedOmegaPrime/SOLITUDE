// src/lib/db.ts
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'database');
const DB_PATH = path.join(DB_DIR, 'solitude.db');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbInstance: Database.Database | null = null;

export function getDb() {
  if (!dbInstance) {
    console.log(`Connecting to SQLite database at: ${DB_PATH}`);
    dbInstance = new Database(DB_PATH, { /* verbose: console.log */ }); // Verbose logging can be noisy
    // Enable WAL mode for better concurrency and performance.
    dbInstance.pragma('journal_mode = WAL');
    initializeSchema(dbInstance);
  }
  return dbInstance;
}

function initializeSchema(db: Database.Database) {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT NOT NULL -- In a real app, HASH this!
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      tags TEXT, -- Comma-separated
      imageUrl TEXT,
      uploaderId TEXT NOT NULL,
      uploaderName TEXT,
      uploadDate TEXT NOT NULL, -- ISO Date String
      category TEXT,
      fileType TEXT,
      fileName TEXT,
      FOREIGN KEY (uploaderId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS forum_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      userId TEXT NOT NULL,
      userName TEXT,
      creationDate TEXT NOT NULL, -- ISO Date String
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS forum_replies (
      id TEXT PRIMARY KEY,
      postId TEXT NOT NULL,
      userId TEXT NOT NULL,
      userName TEXT,
      content TEXT NOT NULL,
      creationDate TEXT NOT NULL, -- ISO Date String
      FOREIGN KEY (postId) REFERENCES forum_posts(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `;
  try {
    db.exec(schema);
    console.log('Database schema initialized or already exists.');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}

// Close the database connection when the app exits (important for graceful shutdown)
process.on('exit', () => {
  if (dbInstance) {
    dbInstance.close();
    console.log('Database connection closed.');
  }
});

process.on('SIGINT', () => {
    if (dbInstance) {
        dbInstance.close();
        console.log('Database connection closed due to app termination (SIGINT).');
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    if (dbInstance) {
        dbInstance.close();
        console.log('Database connection closed due to app termination (SIGTERM).');
    }
    process.exit(0);
});
