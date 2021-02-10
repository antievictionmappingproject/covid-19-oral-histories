// WIP :|

// exports.handler = async function (event, context) {
// 	const apiKey = process.env.AIRTABLE_API_KEY;
// 	const baseID = process.env.AIRTABLE_BASE_ID;
// 	const endpointUrl = "https://api.airtable.com/v0";
// 	("https://api.airtable.com/v0/appND0kbIYWAuIfad/COVID-19%20Oral%20History%20Project?maxRecords=3&view=Interview%20Tracking");
// 	// const Airtable = require("airtable");
// 	// Airtable.configure({
// 	// 	apiKey,
// 	// 	endpointUrl: "https://api.airtable.com",
// 	// });
// 	// const base = Airtable.base(baseID);

// 	// const data = base("COVID-19 Oral History Project").find(
// 	// 	"rec8116cdd76088af",
// 	// 	function (err, record) {
// 	// 		if (err) {
// 	// 			console.error(err);
// 	// 			return;
// 	// 		}
// 	// 		console.log("Retrieved", record.id);
// 	// 	}
// 	// );
// 	// console.log("DATA:", data);
// 	// return {
// 	// 	statusCode: 200,
// 	// 	body: JSON.stringify(data),
// 	// };
// 	const request_url =
// 		endpointUrl +
// 		"/" +
// 		baseID +
// 		"/COVID-19%20Oral%20History%20Project?maxRecords=3&view=Interview%20Tracking";
// 	console.log(request_url);
// 	fetch(request_url, { headers: { Authorization: "Bearer " + apiKey } });
// };

exports.handler = async (event, context) => {
	console.log(event);
	try {
		return {
			statusCode: 200,
			body: JSON.stringify({
				msg: `api key is  ${process.env.AIRTABLE_API_KEY}`,
			}),
		};
	} catch (err) {
		return { statusCode: 500, body: err.toString() };
	}
};
