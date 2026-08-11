const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'Todos los campos son obligatorios' },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'El email ya está registrado' },
      });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno del servidor' },
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'Email y password son obligatorios' },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Credenciales inválidas' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Credenciales inválidas' },
      });
    }

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      error: { code: 'SERVER_ERROR', message: 'Error interno del servidor' },
    });
  }
};

module.exports = { register, login };