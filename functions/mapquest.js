const fetch = require("node-fetch");

exports.handler = function (event, context, callback) {
	fetch(
		`http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}&location=${event.queryStringParameters.location}`
	)
		.then((response) => response.json())
		.then((response) => {
			const result = {
				statusCode: 200,
				body: JSON.stringify(response),
			};
			callback(null, result);
		});
};
