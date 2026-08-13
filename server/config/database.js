const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// ==========================================
// DATABASE PATH
// ==========================================

// Local development:
// server/student.db
//
// Production:
// DB_PATH can point to persistent storage.

const dbPath =
  process.env.DB_PATH ||
  path.join(__dirname, "../student.db");

// ==========================================
// CREATE DATABASE DIRECTORY IF NEEDED
// ==========================================

const dbDirectory = path.dirname(dbPath);

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, {
    recursive: true,
  });
}

// ==========================================
// CONNECT TO SQLITE
// ==========================================

const db = new Database(dbPath);

// ==========================================
// SQLITE SETTINGS
// ==========================================

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ==========================================
// CONNECTION MESSAGE
// ==========================================

console.log("✅ SQLite Database Connected");

if (process.env.NODE_ENV !== "production") {
  console.log(`📁 Database: ${dbPath}`);
}

// ==========================================
// EXPORT DATABASE
// ==========================================

module.exports = db;