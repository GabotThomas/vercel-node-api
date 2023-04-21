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
	const body = req.body;
	if (!body || !body.products) return res.status(404).send();
	Promise.all(
		body.products.map((product, index) => {
			const body = {
				quantity: product.quantity,
				productId: index,
				status: 'supply',
			};
			return fetching(`http://127.0.0.1:5000/api/stock/${index}/movement`, 'POST', body);
		})
	);

	res.status(204).send();
});

// Importing the router
module.exports = router;
