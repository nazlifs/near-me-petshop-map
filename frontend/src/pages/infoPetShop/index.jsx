import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import petshopIcon from "../../assets/iconPS.png";
import axios from "axios";
import { getDistance } from "geolib";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;
    const route = L.Routing.control({
      waypoints: [L.latLng(...from), L.latLng(...to)],
      show: false,
      addWaypoints: false,
      showAlternatives: true,
      draggableWaypoints: false,
      lineOptions: { styles: [{ color: "#1D4ED8", weight: 5 }] },
      createMarker: () => null,
    }).addTo(map);

    return () => map.removeControl(route);
  }, [from, to, map]);

  return null;
};

Routing.propTypes = {
  from: PropTypes.arrayOf(PropTypes.number),
  to: PropTypes.arrayOf(PropTypes.number),
};

const MapCenterer = ({ center }) => {
  const map = useMap();


  useEffect(() => {
    if (center) {
      map.setView(center, 15); // Zoom level 15, bisa disesuaikan
    }
  }, [center, map]);

  return null;
};

MapCenterer.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
};

const Info = () => {
  const navigate = useNavigate();
  const [userLoc, setUserLoc] = useState(null);
  const [petshops, setPetshops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [nearest, setNearest] = useState([]);
  // const [nearestPetShops, setNearestPetShops] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [petshops, setPetshops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [nearest, setNearest] = useState([]);
  // const [nearestPetShops, setNearestPetShops] = useState([]);

  useEffect(() => {
    const load = async () => {
    const load = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8080/api/petshop");
        const shops = res.data.filter((p) => p.latitude && p.longitude);
        setPetshops(shops);
        const res = await axios.get("http://127.0.0.1:8080/api/petshop");
        const shops = res.data.filter((p) => p.latitude && p.longitude);
        setPetshops(shops);

        navigator.geolocation.getCurrentPosition((pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(loc);
        navigator.geolocation.getCurrentPosition((pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(loc);

          const sorted = shops
            .map((s) => ({ ...s, dist: getDistance(loc, [s.latitude, s.longitude]) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2);
          const sorted = shops
            .map((s) => ({ ...s, dist: getDistance(loc, [s.latitude, s.longitude]) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2);

          setNearest(sorted);
          setSelected(sorted[0]);
        });
      } catch (err) {
        console.error("Gagal memuat data petshop:", err);
          setNearest(sorted);
          setSelected(sorted[0]);
        });
      } catch (err) {
        console.error("Gagal memuat data petshop:", err);
      }
    };
    load();
    load();
  }, []);

  const center = userLoc || [3.5853, 98.6756];
  const center = userLoc || [3.5853, 98.6756];

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">Pet Shop Terdekat</h2>
        <button className="w-full mb- py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => navigate("/tambah")}>
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">Pet Shop Terdekat</h2>
        <button className="w-full mb- py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => navigate("/tambah")}>
          Tambah Petshop
        </button>
        {nearest.length > 0 && (
          <div className="bg-white py-2 my-2 rounded-lg">
            <p className="font-semibold mb-2 mx-2">2 Pet Shop Terdekat:</p>
            {nearest.map((shop) => (
              <div key={shop.id} className="bg-gray-100 p-2 mb-2 mx-2 rounded-lg">
                <p>{shop.nama}</p>
                <p>Produk: {Array.isArray(shop.produk) ? shop.produk.join(", ") : "N/A"}</p>
              </div>
            ))}
        {nearest.length > 0 && (
          <div className="bg-white py-2 my-2 rounded-lg">
            <p className="font-semibold mb-2 mx-2">2 Pet Shop Terdekat:</p>
            {nearest.map((shop) => (
              <div key={shop.id} className="bg-gray-100 p-2 mb-2 mx-2 rounded-lg">
                <p>{shop.nama}</p>
                <p>Produk: {Array.isArray(shop.produk) ? shop.produk.join(", ") : "N/A"}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white py-2 my-2 rounded-lg">
          <p className="font-semibold mb-2 mx-2">Pet Shop</p>
          {petshops.map((shop) => (
            <div key={shop.id} className={`p-2 mb-2 mx-2 cursor-pointer rounded ${selected?.id === shop.id ? "bg-blue-100" : "bg-gray-100"} hover:bg-blue-50`} onClick={() => setSelected(shop)}>
              <p className="font-semibold">{shop.nama}</p>
              <p className="text-sm text-gray-600">Produk: {Array.isArray(shop.produk) ? shop.produk.join(", ") : "N/A"}</p>
            </div>
          ))}
        </div>
        <div className="bg-white py-2 my-2 rounded-lg">
          <p className="font-semibold mb-2 mx-2">Pet Shop</p>
          {petshops.map((shop) => (
            <div key={shop.id} className={`p-2 mb-2 mx-2 cursor-pointer rounded ${selected?.id === shop.id ? "bg-blue-100" : "bg-gray-100"} hover:bg-blue-50`} onClick={() => setSelected(shop)}>
              <p className="font-semibold">{shop.nama}</p>
              <p className="text-sm text-gray-600">Produk: {Array.isArray(shop.produk) ? shop.produk.join(", ") : "N/A"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-3/4">
        <MapContainer center={center} zoom={15} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selected && <MapCenterer center={[selected.latitude, selected.longitude]} />}
          {userLoc && (
            <Marker position={userLoc}>
      <div className="w-3/4">
        <MapContainer center={center} zoom={15} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selected && <MapCenterer center={[selected.latitude, selected.longitude]} />}
          {userLoc && (
            <Marker position={userLoc}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          )}
          {petshops.map((shop) => (
            <Marker key={shop.id} position={[shop.latitude, shop.longitude]} icon={L.icon({ iconUrl: petshopIcon, iconSize: [25, 41], iconAnchor: [12, 41] })} eventHandlers={{ click: () => setSelected(shop) }}>
          {petshops.map((shop) => (
            <Marker key={shop.id} position={[shop.latitude, shop.longitude]} icon={L.icon({ iconUrl: petshopIcon, iconSize: [25, 41], iconAnchor: [12, 41] })} eventHandlers={{ click: () => setSelected(shop) }}>
              <Popup>
                {shop.nama}
                {shop.nama}
                <br />
                Produk: {Array.isArray(shop.produk) ? shop.produk.join(", ") : "N/A"}
                Produk: {Array.isArray(shop.produk) ? shop.produk.join(", ") : "N/A"}
              </Popup>
            </Marker>
          ))}
          {userLoc && selected && <Routing from={userLoc} to={[selected.latitude, selected.longitude]} />}
          {userLoc && selected && <Routing from={userLoc} to={[selected.latitude, selected.longitude]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Info;