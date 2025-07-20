const express = require("express");
const cors = require("cors");
const app = express();
const petshopRoutes = require("./routes/petshopRoutes");

// Middleware.
app.use(cors()); // Tambahkan ini untuk mengizinkan CORS
app.use(express.json());

// Rute
app.use("/api/petshop", petshopRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
