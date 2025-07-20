const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi untuk menambah pet shop.
exports.createPetShop = async (data) => {
  return await prisma.petShop.create({
    data: {
      nama: data.nama,
      longitude: data.longitude,
      latitude: data.latitude,
      produk: data.produk, // JSON produk
    },
  });
};

// Fungsi untuk mendapatkan semua pet shop
exports.getAllPetShops = async () => {
  return await prisma.petShop.findMany();
};
