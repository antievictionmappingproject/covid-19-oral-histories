import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	MapContainer,
	TileLayer,
	LayersControl,
	Pane,
	GeoJSON,
	ZoomControl,
	Marker,
	Popup,
} from "react-leaflet";
import { Icon,  } from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useTranslation } from "react-i18next";
import MarkerImage from "../assets/location-icon.svg"
// import HouseIcon from "../components/HouseIcon"

import getMapConfig from "../config/map-config";


const HouseIcon = new Icon({
  iconUrl: MarkerImage,
  iconRetinaUrl: MarkerImage,
  iconSize: [45, 50],
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
});

console.log(HouseIcon)

function LeafletMap({ mapConfig }) {
	// const layers = useSelector(state => state.data.layers);
	// const layers = [];
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [interviews, setInterviews] = useState([]);

	useEffect(() => {
		getAirtableData()
	}, []);

	async function getAirtableData() {
		fetch(`/.netlify/functions/airtable`)
			.then((data) => data.json())
			.then((data) => {
				// for each record get the location field and, if it exists map that to a lat long

				let promises = [];
				data.records.forEach((record) => {
					const location = record.fields["Geo-Location for map"];
					// if location field is not empty
					if (location) {
						// get the geocoded latitude and longitude for that string
						let location_promise = fetch(
							`/.netlify/functions/mapquest?location=${location}`
						)
							.then((data) => data.json())
							.then((data) => {
								// if mapquest geocode call was succesful
								if (data.info.statuscode == 0) {
									// ARBITRARY: grab the first result and add it to the record
									const { lat, lng } = data.results[0].locations[0].latLng;
									record.fields["Geo-Location for map latlong"] = [lat, lng];
									console.log(record);
								}
							});

						promises.push(location_promise);
					}
				});
				Promise.all(promises).then(() => {
					setInterviews(data.records);
				});
			});
	}

	return (
		<>
			{interviews.filter(i => i.fields["Geo-Location for map latlong"]).map((interview) => {
				return (
					<Marker
						key={interview.id}
						position={interview.fields["Geo-Location for map latlong"]}
						icon={HouseIcon}
					>
						<Popup>hello</Popup>
					</Marker>
				);
			})}
			<LayersControl collapsed={false} position="topright"></LayersControl>
			<ZoomControl position="bottomright" />
		</>
	);
}

export default (props) => {
	const mapConfig = getMapConfig();

	// Map component id prop may be an anti-pattern
	return (
		<MapContainer
			zoomControl={false}
			center={[mapConfig.lat, mapConfig.lng]}
			minZoom={3}
			zoom={mapConfig.z}
			id="map"
		>
			<TileLayer
				attribution="<a href='https://www.antievictionmap.com/' target='_blank'>Anti-Eviction Mapping Project</a>"
				url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
			/>
			<LeafletMap mapConfig={mapConfig} />
		</MapContainer>
	);
};
