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
import HouseIcon from "../components/HouseIcon"
import getMapConfig from "../config/map-config";
import { fetchAirtableData } from "../reducers/data";


function LeafletMap({ mapConfig }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const interviews = useSelector(state => state.data.interviews)

	useEffect(() => {
		dispatch(fetchAirtableData);
	}, []);

	return (
		<>
			{interviews.filter(i => i.fields["Geo-Location for map latlong"]).map((interview) => {
				return (
					<Marker
						key={interview.id}
						position={interview.fields["Geo-Location for map latlong"]}
						icon={HouseIcon}
						eventHandlers={{
							click: e => {
								dispatch({ type: 'ui:interview:selected', payload: interview })
							}
						}}
					>
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
