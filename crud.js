const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Armazenamento em memória para os veículos e usuários
let veiculos = [];
let usuarios = [];
let idCounter = 1;
let userIdCounter = 1;

// Chave secreta para JWT
const JWT_SECRET = 'sua-chave-secreta';

// Endpoint para criar veículo
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

// Endpoint para atualizar veículo
app.put('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    const { cor, preco } = req.body;

    const veiculo = veiculos.find(v => v.id == id);
    if (!veiculo) {
        return res.status(404).json({ message: 'Veículo não encontrado. O usuário deve voltar para o menu inicial depois.' });
    }

    if (cor) veiculo.cor = cor;
    if (preco) veiculo.preco = preco;

    res.json(veiculo);
});

// Endpoint para remover veículo
app.delete('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    const index = veiculos.findIndex(v => v.id == id);

    if (index === -1) {
        return res.status(404).json({ message: 'Veículo não encontrado. O usuário deve voltar para o menu inicial depois.' });
    }

    veiculos.splice(index, 1);
    res.status(204).send();
});



// Endpoint para criar um usuário
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const usuario = { id: userIdCounter++, nome, email, senha: hashedPassword };

    usuarios.push(usuario);
    res.status(201).json({ message: 'Usuário criado com sucesso.' });
});

// Endpoint para logar um usuário
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) {
        return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET);
    res.json({ token });
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
