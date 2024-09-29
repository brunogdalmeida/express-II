const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port for Render

// Middleware
app.use(bodyParser.json());

// In-memory storage
let veiculos = [];
let usuarios = [];
let idCounter = 1;
let userIdCounter = 1;

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Load from environment variable

// Endpoint to create vehicle
app.post('/veiculos', (req, res) => {
    const { modelo, marca, ano, cor, preco } = req.body;

    if (!modelo || !marca || !ano || !cor || !preco) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const veiculo = {
        id: idCounter++,
        modelo,
        marca,
        ano,
        cor,
        preco
    };

    veiculos.push(veiculo);
    res.status(201).json(veiculo);
});

// Other endpoints (update, delete, create user, login) remain unchanged...

// Start the server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
