const initialState = {
  layers: [],
  interviews: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'data:layers':
      return {
        ...state,
        layers: action.payload,
      };
    case 'data:interviews':
      return {
        ...state,
        interviews: action.payload
      }
    default:
      return state;
  }
};

export async function fetchAirtableData(dispatch, getState) {
  const response = await fetch(`/.netlify/functions/airtable`)
  const data = await response.json()
  const records = await Promise.all(data.records.map((record) => {
    // for each record get the location field and, if it exists map that to a lat long
    const location = record.fields["Geo-Location for map"];
    return (location // if location field is not empty
      ? fetch(`/.netlify/functions/mapquest?location=${location}`)
        .then((data) => data.json())
        .then((data) => {
          // if mapquest geocode call was succesful
          if (data.info.statuscode == 0) {
            // ARBITRARY: grab the first result and add it to the record
            const { lat, lng } = data.results[0].locations[0].latLng;
            record.fields["Geo-Location for map latlong"] = [lat, lng];
            return record
          }
        })
      : Promise.resolve(record))
  }));
  dispatch({type: 'data:interviews', payload: records});
}