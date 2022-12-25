require('dotenv')
const express = require('express');
const cors = require('cors');
const con = require('./db');

const app = express();


app.use(express.json())
app.use(cors());


app.post('/users', (req, res, next) => {
	const users = req.body;
	let mysql = 'INSERT INTO main.users (id,name,surname,dob,gender) VALUES ?'
	try {
		con.query(mysql, [users.map(user => [user.id, user.name, user.surname, user.dob, user.gender])], (err, results, fields) => {
			if (err) {
				next({ message: err });
			}
			if (results) {
				console.log(results)
				res.status(200).json({ message: 'Inserted' });
			}
			if (fields) console.log(fields);
		});
	} catch (err) {
		res.status(500).json({ message: err })
	}
})


app.use((err, req, res, next) => {
	console.log('Global Error ', err);
	res.status(500).json(err);
})



con.connect((err) => {
	if (err) console.log(err);
	console.log('Connected');

	con.query('CREATE DATABASE IF NOT EXISTS main;')
	con.query('USE main;')
	con.query('DROP TABLE users;');
	con.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL, name varchar(30), surname varchar(255), gender varchar(10),dob DATE, PRIMARY KEY(id));', (error, result, fields) => {
		console.log(result);
	});
})
app.listen(3002, () => console.log('listening'));