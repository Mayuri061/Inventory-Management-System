const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shital@123', 
    database: 'inventory_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.get('/items', (req, res) => {
    let query = 'SELECT * FROM items';
    if (req.query.sortBy) {
        query += ` ORDER BY price ${req.query.sortBy}`;
    }
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/items', (req, res) => {
    const { name, quantity, price, category } = req.body;
    const query = 'INSERT INTO items (name, quantity, price, category) VALUES (?, ?, ?, ?)';
    db.query(query, [name, quantity, price, category], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, name, quantity, price, category });
    });
});

app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, category } = req.body;
    const query = 'UPDATE items SET name = ?, quantity = ?, price = ?, category = ? WHERE id = ?';
    db.query(query, [name, quantity, price, category, id], (err, results) => {
        if (err) throw err;
        res.json({ id, name, quantity, price, category });
    });
});

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) throw err;
        res.json({ id });
    });
});

app.get('/total', (req, res) => {
    db.query('SELECT SUM(price * quantity) AS totalValue FROM items', (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
