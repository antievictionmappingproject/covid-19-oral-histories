/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Modal from "./Modal";
import LoadingIndicator from "./LoadingIndicator";
import InfoWindow from "./InfoWindow";
import LeafletMap from "./Map";
import Navigation from "./Navigation";
// import Titlebox from "./Titlebox";
// import SearchBar from "./SearchBar";
import { i18nInit } from "../utils/i18n";
import { Translation } from "react-i18next";
import { getAllCartoLayers } from "../carto/api";

export default () => {
	const i18nLoaded = useSelector((state) => state.content.i18n);
	const dispatch = useDispatch();
	const interviewSelected = useSelector((state) => state.ui.interviewSelected);

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
			{interviewSelected && <InfoWindow />}
			<Navigation />
		</>
	);
};
