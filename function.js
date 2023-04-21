const fetching = async (url, method, body = {}) => {
	const params = { method, headers: { 'Content-Type': 'application/json' } };
	params.body = JSON.stringify(body);
	const response = await fetch(url, params);
	return response.json();
};

exports.fetching = fetching;
