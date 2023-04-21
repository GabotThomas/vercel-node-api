// Importing express module
const express = require('express');
const { fetching } = require('./function');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const filePath = path.join('./', 'supplies.json');

// Handling request using router
router.post('/', (req, res, next) => {
	const body = req.body;

	if (!body || !body.products) return res.status(404).send();
	try {
		const responses = Promise.all(
			body.products.map((product, index) => {
				if (product.id) {
					return addStock(product);
				} else {
					return createProduct(product);
				}
			})
		);
	} catch (e) {
		console.log(e);
	}

	res.status(204).send();
});

router.get('/summary', (req, res, next) => {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) return;
		const supplies = JSON.parse(data);
		const summary = supplies.reduce(
			(acc, supply) => {
				acc.nbSupplies++;
				acc.totalNbProducts += supply.quantity;
				acc.totalPurchasePrice += supply.quantity * supply.purchasePricePerUnit;
				return acc;
			},
			{
				nbSupplies: 0,
				totalNbProducts: 0,
				totalPurchasePrice: 0,
			}
		);

		res.status(200).send(summary);
	});
});

const addStock = async product => {
	const body = {
		quantity: product.quantity,
		productId: product.id,
		status: 'supply',
	};
	return fetching(`http://127.0.0.1:5000/api/stock/${product.id}/movement`, 'POST', body);
};

const createProduct = async product => {
	const body = {
		ean: product.ean,
		name: product.name,
		description: product.description,
		categories: ['game'],
		price: product.purchasePricePerUnit,
	};
	const response = await fetching(
		`http://microservices.tp.rjqu8633.odns.fr/api/products`,
		'POST',
		body
	);

	if (response.id) {
		return addStock({ ...product, id: response.id });
	}

	return;
};

// Importing the router
module.exports = router;
