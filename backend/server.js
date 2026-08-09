require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 4000;

// Conectar con MongoDB Atlas
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});