import { Icon } from 'leaflet';
import MarkerImage from "../assets/location-icon.svg";

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

export default HouseIcon;