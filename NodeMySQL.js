const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2020BTECS00003',
    database: 'mrk'
});

db.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('MySql Connected...');
    }
});

app.get('/api/get', (req, res) => {
    const sqlSelect = "SELECT * FROM mytable";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

app.post('/api/insert', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    
    const sqlInsert = "INSERT INTO mytable (id, name, age) VALUES (?, ?, ?)";
    db.query(sqlInsert, [id, name, age], (err, result) => {
        console.log(err);
        if(err)
            res.send(err);
        else
            res.send(result);
    });
});

app.put('/api/update', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const age = req.body.age;
    const sqlUpdate = "UPDATE mytable SET age = ?, name = ? WHERE id = ?";
    db.query(sqlUpdate, [age,name,id], (err, result) => {
        if(err)
            res.send(err);
        else
            res.send(result);
    });
});

app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id; console.log(id);
    const sqlDelete = "DELETE FROM mytable WHERE id = ?";
    db.query(sqlDelete, [id], (err, result) => {
        if(err)
            res.send(err);
        else
            res.send(result);
    });
});

app.listen(5000, () => {
    console.log('Server is running at port 5000');
});