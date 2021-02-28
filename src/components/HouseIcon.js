import L from 'leaflet';

export default new L.Icon({
  iconUrl: require('../assets/location-icon.svg'),
  iconRetinaUrl: require('../assets/location-icon.svg'),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(45, 50),
  className: 'leaflet-div-icon',
});