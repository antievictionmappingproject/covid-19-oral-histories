// WIP :|
const fetch = require("node-fetch");

exports.handler = function (event, context, callback) {
	const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
	const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
	const Airtable = require("airtable");
	Airtable.configure({
		apiKey: AIRTABLE_API_KEY,
		endpointUrl: "https://api.airtable.com",
	});
	const base = Airtable.base(AIRTABLE_BASE_ID);

	const allRecords = [];
	base("Content Creation")
		.select({
			// Selecting the first 3 records in Interview Tracking:
			view: "Brett's View - Call to Action Button",
		})
		.eachPage(
			function page(records, fetchNextPage) {
				// This function (`page`) will get called for each page of records.

				records.forEach(function (record) {
					allRecords.push(record);
				});

				// To fetch the next page of records, call `fetchNextPage`.
				// If there are more records, `page` will get called again.
				// If there are no more records, `done` will get called.
				fetchNextPage();
			},
			function done(err) {
				if (err) {
					callback(err);
				} else {
					console.log(allRecords.length);
					const response = {
						statusCode: 200,
						body: JSON.stringify({ records: allRecords }),
						headers: {
							"content-type": "application/json",
							"cache-control": "Cache-Control: max-age=60, public",
						},
					};
					callback(null, response);
				}
			}
		);
};
