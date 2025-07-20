const petshopService = require("../services/petshopService");

// Controller untuk menambah pet shop.
exports.addPetShop = async (req, res) => {
  try {
    const { nama, longitude, latitude, produk } = req.body;
    const petshop = await petshopService.createPetShop({
      nama,
      longitude,
      latitude,
      produk,
    });
    res.status(201).json(petshop);
  } catch (error) {
    console.error("error in create", error);
    res.status(400).json({ error: "Error adding pet shop" });
  }
};

// Controller untuk mendapatkan semua pet shop
exports.getAllPetShops = async (req, res) => {
  try {
    const petShops = await petshopService.getAllPetShops();
    res.status(200).json(petShops);
  } catch (error) {
    res.status(400).json({ error: "Error fetching pet shops" });
  }
};
