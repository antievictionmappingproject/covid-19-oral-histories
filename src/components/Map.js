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
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useTranslation } from "react-i18next";
import HouseIcon from "../components/HouseIcon";
import getMapConfig from "../config/map-config";
import { fetchAirtableData } from "../reducers/data";

function LeafletMap({ mapConfig }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const interviews = useSelector((state) => state.data.interviews);

	useEffect(() => {
		dispatch(fetchAirtableData);
	}, []);

	return (
		<>
			{interviews
				.filter(
					(i) =>
						i.fields["Latitude"] &&
						i.fields["Longitude"] &&
						i.fields["ENTRY COMPLETED"]
				)
				.map((interview) => {
					return (
						<Marker
							key={interview.id}
							position={[
								interview.fields["Latitude"],
								interview.fields["Longitude"],
							]}
							icon={HouseIcon}
							eventHandlers={{
								click: (e) => {
									dispatch({
										type: "ui:interview:selected",
										payload: interview,
									});
								},
							}}
						></Marker>
					);
				})}
			<LayersControl collapsed={false} position="topright"></LayersControl>
			<ZoomControl position="bottomright" />
		</>
	);
}

const Map = (props) => {
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
				url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png"
			/>
			<LeafletMap mapConfig={mapConfig} />
		</MapContainer>
	);
};

export default Map;
