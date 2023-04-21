// Importing express module
const express = require('express');
const { fetching } = require('./function');
const router = express.Router();

// export interface SupplyProductDto {
// 	ean: string;
// 	name: string;
// 	description: string;
// 	purchasePricePerUnit: number;
// 	quantity: number;
// }

// Handling request using router
router.post('/', (req, res, next) => {
	console.log('body :');
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
		console.log('test');
		console.log(e);
	}

	res.status(204).send();
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
