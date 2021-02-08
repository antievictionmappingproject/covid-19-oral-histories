// WIP :|

exports.handler = async function(event, context) {
  const apiKey = process.env.AIRTABLE_API_KEY
  const Airtable = require('airtable');
  Airtable.configure({
    apiKey,
    endpointUrl: 'https://api.airtable.com',
  })
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
  const data = base('Interviews').find('reccTvXoPbYT7plFE', function(err, record) {
    if (err) { console.error(err); return; }
    console.log('Retrieved', record.id);
  })
  console.log("DATA:", data)
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}