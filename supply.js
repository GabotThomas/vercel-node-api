// Importing express module
const express = require('express');
const { fetching } = require('./function');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'supplies.json');
const { v4: uuid } = require('uuid');

// Handling request using router
router.post('/', (req, res, next) => {
	const body = req.body;

	if (!body || !body.products) return res.status(404).send();
	try {
		Promise.all(
			body.products.map((product, index) => {
				if (product.id) {
					return addStock(product);
				} else {
					return createProduct(product);
				}
			})
		);

		const supplies = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		const global = body.products.reduce(
			(acc, product) => {
				acc.quantity += product.quantity;
				acc.totalPrice += product.quantity * product.purchasePricePerUnit;
				return acc;
			},
			{
				quantity: 0,
				totalPrice: 0,
			}
		);

		const newSupply = {
			id: uuid(),
			...global,
		};

		supplies.push(newSupply);
		fs.writeFileSync(filePath, JSON.stringify(supplies));
	} catch (e) {
		console.log(e);
	}

	res.status(204).send();
});

router.get('/summary', (req, res, next) => {
	let supplies;
	try {
		supplies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (e) {
		console.log(e);
	}

	const summary = supplies.reduce(
		(acc, supply) => {
			acc.nbSupplies++;
			acc.totalNbProducts += supply.quantity;
			acc.totalPurchasePrice += supply.totalPrice;
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

const addStock = async product => {
	try {
		const body = {
			quantity: product.quantity,
			productId: product.id,
			status: 'supply',
		};
		return fetching(
			`https://vercel-stock-microservices.vercel.app/api/stock/${product.id}/movement`,
			'POST',
			body
		);
	} catch (e) {
		console.log(e);
	}
	return;
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
	console.log(response);
	if (response.id) {
		return addStock({ ...product, id: response.id });
	}

	return;
};

// Importing the router
module.exports = router;
