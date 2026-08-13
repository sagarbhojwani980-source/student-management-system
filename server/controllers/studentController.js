const db = require("../config/database");

// =========================
// Add Student
// =========================
const addStudent = (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            course,
            semester
        } = req.body;

        const query = db.prepare(`
            INSERT INTO students
            (firstName, lastName, email, phone, gender, course, semester)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const result = query.run(
            firstName,
            lastName,
            email,
            phone,
            gender,
            course,
            semester
        );

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            id: result.lastInsertRowid
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Get All Students
// =========================
const getStudents = (req, res) => {
    try {
        const students = db.prepare("SELECT * FROM students").all();

        res.json(students);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Update Student
// =========================
const updateStudent = (req, res) => {
    try {
        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            course,
            semester
        } = req.body;

        const query = db.prepare(`
            UPDATE students
            SET
                firstName = ?,
                lastName = ?,
                email = ?,
                phone = ?,
                gender = ?,
                course = ?,
                semester = ?
            WHERE id = ?
        `);

        const result = query.run(
            firstName,
            lastName,
            email,
            phone,
            gender,
            course,
            semester,
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Delete Student
// =========================
const deleteStudent = (req, res) => {
    try {
        const { id } = req.params;

        const query = db.prepare("DELETE FROM students WHERE id = ?");

        const result = query.run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent
};