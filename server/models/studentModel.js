const db = require("../config/database");

const createStudentTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      gender TEXT,
      course TEXT,
      semester INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log("✅ Students table is ready");
};

module.exports = createStudentTable;