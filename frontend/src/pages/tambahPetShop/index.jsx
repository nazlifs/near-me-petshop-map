import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tambah = () => {
  // State untuk menyimpan data input
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [products, setProducts] = useState([{ product: '' }]); // Menyimpan daftar produk
  const navigate = useNavigate();

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'latitude') setLatitude(value);
    if (name === 'longitude') setLongitude(value);
  };

  // Fungsi untuk menangani perubahan pada produk
  const handleProductChange = (index, e) => {
    const updatedProducts = [...products];
    updatedProducts[index].product = e.target.value;
    setProducts(updatedProducts);
  };

  // Fungsi untuk menambah form produk baru
  const addProductInput = () => {
    setProducts([...products, { product: '' }]);
  };

  // Fungsi untuk menangani pengiriman data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8080/api/petshop', {
        nama: name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        produk: products.map((p) => p.product), // Mengirim daftar produk
      });
      console.log('Petshop added:', response.data);
      // Reset form fields
      setName('');
      setLatitude('');
      setLongitude('');
      setProducts([{ product: '' }]);
      navigate('/')
    } catch (error) {
      console.error('Error adding petshop:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white w-full max-w-lg shadow-lg border border-gray-300 p-8 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Tambah Petshop</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nama Petshop"
            value={name}
            onChange={handleChange}
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={latitude}
            onChange={handleChange}
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={longitude}
            onChange={handleChange}
            className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-indigo-500"
          />

          {products.map((product, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                name="product"
                placeholder={`Produk ${index + 1}`}
                value={product.product}
                onChange={(e) => handleProductChange(index, e)}
                className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addProductInput}
            className="w-full h-[50px] bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"
          >
            Tambah Produk
          </button>

          <button
            type="submit"
            className="w-full h-[50px] bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"
          >
            Tambah Petshop
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full h-[50px] bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tambah;
