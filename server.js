const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

//  BASE DE DATOS DE USUARIOS
let usuarios = [{ username: "admin", password: "1234" }];

// 🗄️ BASE DE DATOS DE CIUDADANOS
let ciudadanos = [
  {
    cedula: "402-2456789-1",
    nombre: "MARÍA ELENA RODRÍGUEZ SANTOS",
    emision: "01/06/2020",
    vencimiento: "01/06/2030",
    licencia: "LIC-2456789",
    categoria: "Categoría 2",
    estadoLicencia: "Vigente",
    vehiculo: {
      placa: "A123456",
      marca: "Toyota Corolla",
      año: "2022",
      marbete: "Vigente 2026",
    },
    multas: [
      {
        id: 1,
        tipo: "Exceso de Velocidad",
        monto: 2500,
        fecha: "2026-03-15",
        lugar: "Autopista Duarte, KM 12",
      },
      {
        id: 2,
        tipo: "Cruce de Luz Roja",
        monto: 3000,
        fecha: "2026-02-28",
        lugar: "Av. 27 de Febrero esq. Tiradentes",
      },
    ],
    antecedentes: "Sin Antecedentes Penales",
    impuestos: "Al Día",
  },
];

// --- RUTAS DE NAVEGACIÓN ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "dashboard.html"))
);

// --- RUTAS DE API (AUTENTICACIÓN) ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.json({ token: "fake-jwt-token", msg: "Acceso concedido" });
  } else {
    res.status(401).json({ msg: "Usuario o contraseña incorrectos" });
  }
});

// --- RUTAS DE API (CIUDADANOS) ---
app.get("/api/ciudadano/:cedula", (req, res) => {
  const persona = ciudadanos.find((c) => c.cedula === req.params.cedula);
  if (!persona) return res.status(404).json({ msg: "No encontrado" });
  res.json(persona);
});

app.post("/api/ciudadano/registro", (req, res) => {
  const nuevo = req.body;
  // Aseguramos que el nuevo registro tenga estructura de multas aunque sea vacía
  if (!nuevo.multas) nuevo.multas = [];
  ciudadanos.push(nuevo);
  res.json({ msg: "Registro exitoso", ciudadano: nuevo });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Sistema RD corriendo en puerto ${PORT}`)
);
