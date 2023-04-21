const fetching = async (url, method, body) => {
	const params = { method, headers: { 'Content-Type': 'application/json' } };
	if (body) {
		params.body = JSON.stringify(body);
	}

	const response = await fetch(url, params);
	try {
		const json = await response.json();
		return json;
	} catch (e) {
		return response;
	}
};

exports.fetching = fetching;
