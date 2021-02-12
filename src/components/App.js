import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Modal from "./Modal";
import LoadingIndicator from "./LoadingIndicator";
import InfoWindow from "./InfoWindow";
import LeafletMap from "./Map";
// import Titlebox from "./Titlebox";
// import SearchBar from "./SearchBar";
import { i18nInit } from "../utils/i18n";
import { Translation } from "react-i18next";
import { getAllCartoLayers } from "../carto/api";

export default () => {
	const i18nLoaded = useSelector((state) => state.content.i18n);
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			await i18nInit();
		})();
		return () => null;
	}, []);

	useEffect(() => {
		(async () => {
			const cartoData = await getAllCartoLayers();
			dispatch({ type: "data:layers", payload: cartoData });
			dispatch({ type: "ui:loading-indicator:hide" });
		})();

		return () => null;
	}, [dispatch]);
	if (!i18nLoaded) {
		return null;
	}

	// get the airtable data
	fetch(`/.netlify/functions/airtable`)
		.then((data) => data.json())
		.then((data) => {
			console.log(data);
			// for each record get the location field and, if it exists map that to a lat long
			data.records.forEach((record) => {
				const location = record.fields["Geo-Location for map"];
				// if location field is not empty
				if (location) {
					// get the geocoded latitude and longitude for that string
					fetch(`/.netlify/functions/mapquest?location=${location}`)
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
				}
			});
		});

	return (
		<>
			<Translation>
				{(t, { i18n }) => {
					document.title = t("page-title");
					document
						.querySelector('meta[name="description"]')
						.setAttribute("content", t("titlebox.about-description"));
					return null;
				}}
			</Translation>
			<LeafletMap />
			<LoadingIndicator />
			<InfoWindow />
		</>
	);
};
