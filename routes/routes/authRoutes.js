const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET = "qa_secret";

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ msg: "Usuario creado exitosamente" });
  } catch (err) {
    res.status(400).json({ msg: "Error al registrar: " + err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Simulación para QA si no hay base de datos
  if (username === "admin" && password === "1234") {
      const token = jwt.sign({ username, role: "admin" }, SECRET);
      return res.json({ token });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password)
      return res.status(401).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

module.exports = router;