const express = require("express");
const petshopController = require("../controllers/petshopController");
const router = express.Router();

// Route untuk menambahkan pet shop.
router.post("/", petshopController.addPetShop);

// Route untuk mendapatkan semua pet shop
router.get("/", petshopController.getAllPetShops);

module.exports = router;
