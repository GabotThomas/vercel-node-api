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
const { fetching } = require('./function');

app.get('/api/ping', (req, res) => {
	res.send('PONG');
});

app.use('/api/supply', supplyRoute);

app.post('/api/supply-needed', async (req, res) => {
	try {
		const { productId } = req.body;
		if (!productId) {
			throw new Error('Missing productId');
		}
		//   const { data } = await axios.get(
		// 	`http://microservices.tp.rjqu8633.odns.fr/api/products/${productId}`
		//   )
		const data = await fetching(
			`http://microservices.tp.rjqu8633.odns.fr/api/products/${productId}`,
			'GET'
		);

		const newReq = await fetching(
			`http://microservices.tp.rjqu8633.odns.fr/api/supply-request`,
			'POST',
			{
				ean: data.ean,
			}
		);
		res.status(204).end();
	} catch (error) {
		res.status(500).send('Internal server error');
	}
});

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
