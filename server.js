const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Connect to existing SQLite database
const db = new sqlite3.Database("../quiz.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database!");
    }
});


// Test API
app.get("/", (req, res) => {
    res.send("Quiz Backend is Running!");
});


// Get all questions from database
app.get("/questions", (req, res) => {

    const sql = "SELECT * FROM questions";

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.error(err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);

    });

});


// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});