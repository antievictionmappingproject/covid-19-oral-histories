## Running the repo

#To run app, run these commands
export AIRTABLE_API_KEY=[you airtable api key here]
export AIRTABLE_BASE_ID=[your base id here]
netlify dev

There is likely a better way to have access to these in process.env in the local dev, but a few things I tried didn't work -Bora

## To do

- test airtable call deployed in netlify
- make call in airtable in correct location, not randomly in App.js
- create leaflet markers from records
- load audio file from url
- implement sound visualizer
