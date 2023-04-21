// Add Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
//Route
const supplyRoute = require('./supply');

app.get('/api/ping', (req, res) => {
	res.send('PONG');
});

app.use('/api/supply', supplyRoute);

//to delete
app.post('/api/stock/:id/movement', (req, res, next) => {
	console.log('Stock :', req.body);
	res.status(204).send();
});

// Initialize server
app.listen(5000, () => {
	console.log('Running on port 5000.');
});

module.exports = app;
