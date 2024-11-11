import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getDistance } from 'geolib';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import petshopIcon from '../../assets/iconPS.png';
import axios from 'axios';

const FlyToLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 15);
    }
  }, [location, map]);

  return null;
};

FlyToLocation.propTypes = {
  location: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const Info = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [nearestPetShop, setNearestPetShop] = useState(null);
  const [selectedPetShop, setSelectedPetShop] = useState(null);
  const [petShops, setPetShops] = useState([]);

  useEffect(() => {
    const fetchPetShops = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/api/petshop');
        const petShopsData = response.data;

        // Validasi data lokasi
        const validatedPetShops = petShopsData.filter(petShop => {
          return typeof petShop.longitude === 'number' &&
                 typeof petShop.latitude === 'number';
        });

        setPetShops(validatedPetShops);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userLoc = [latitude, longitude];
            setUserLocation(userLoc);

            const nearest = validatedPetShops.reduce((nearest, petShop) => {
              const distance = getDistance(userLoc, [petShop.latitude, petShop.longitude]);
              return distance < nearest.distance ? { petShop, distance } : nearest;
            }, { petShop: null, distance: Infinity });

            setNearestPetShop(nearest.petShop);
            setSelectedPetShop(nearest.petShop);
          });
        }
      } catch (error) {
        console.error('Error fetching pet shops:', error);
      }
    };

    fetchPetShops(); // Fetch data only once
  }, []);

  const center = userLocation || [3.5853, 98.6756]; // Default location jika lokasi user tidak tersedia

  const handlePetShopClick = (petShop) => {
    setSelectedPetShop(petShop);
  };

  const handleMarkerClick = (petShop) => {
    setSelectedPetShop(petShop);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Info Pet Shop</h2>
        <button
          className="text-xl font-semibold mb-4 border w-full h-[50px] rounded-md bg-blue-500 text-white"
          onClick={() => navigate('/tambah')}
        >
          Tambah Petshop
        </button>
        {nearestPetShop && (
          <div className="p-2 mb-4 bg-green-100">
            <h3 className="text-lg font-semibold">Pet Shop Terdekat</h3>
            <p>{nearestPetShop.nama}</p>
            <p>Produk: {nearestPetShop.produk.join(', ')}</p>
          </div>
        )}

        {petShops.map((petShop) => (
          <div
            key={petShop.id}
            className={`p-2 mb-2 cursor-pointer ${
              selectedPetShop && selectedPetShop.id === petShop.id ? 'bg-blue-100' : 'bg-white'
            } hover:bg-blue-50`}
            onClick={() => handlePetShopClick(petShop)}
          >
            <h3 className="text-lg font-semibold">{petShop.nama}</h3>
            <p>Produk: {petShop.produk.join(', ')}</p>
          </div>
        ))}
      </div>

      <div className="w-3/4">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          )}
          {petShops.map((petShop) => (
            <Marker
              key={petShop.id}
              position={[petShop.latitude, petShop.longitude]}
              icon={L.icon({ iconUrl: petshopIcon, iconSize: [25, 41], iconAnchor: [12, 41] })}
              eventHandlers={{
                click: () => handleMarkerClick(petShop),
              }}
            >
              <Popup>
                {petShop.nama}
                <br />
                Produk: {petShop.produk.join(', ')}
              </Popup>
            </Marker>
          ))}

          {selectedPetShop && <FlyToLocation location={[selectedPetShop.latitude, selectedPetShop.longitude]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Info;
