const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const app = express();

const hostname = 'localhost';
const port = 3000;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'Jean',
    password: 'j1e2a3n4',
    database: 'Site',
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão estabelecida com o banco de dados!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginaPrincipal.html'));
});


app.get('/api/carrinho/:emailUsuario', (req, res) => {
    const emailUsuario = req.params.emailUsuario;

    // Verificar se há um usuário logado
    if (!emailUsuario) {
        res.status(401).json({ error: 'Nenhum usuário logado' });
        return;
    }

    // Buscar os produtos do carrinho do usuário no banco de dados
    const query = 'SELECT emailUsuario, nomeProduto, precoProduto, idProduto FROM Carrinho WHERE emailUsuario = ?';

    connection.query(query, [emailUsuario], (err, results) => {
        if (err) {
            console.error('Erro ao buscar carrinho do usuário:', err);
            res.status(500).json({ error: 'Erro ao buscar carrinho do usuário' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/buscar-produto', (req, res) => {
    const query = 'SELECT id, nome, preco FROM Produto';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao obter os produtos' });
            return;
        }
        res.json(results);
    });
});
app.get('/api/buscar-nome', (req, res) => {
    const query = 'SELECT id, nome FROM Produto';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao obter os nomes' });
            return;
        }
        res.json(results);
    });
});
app.get('/api/buscar-preco', (req, res) => {
    const query = 'SELECT id, preco FROM Produto';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao obter os nomes' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/info-cliente', (req, res) => {
    const query = 'SELECT nome, email, senha FROM Usuario';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao obter Usuario' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/cadastrar-cliente', (req, res) => {
    const { nome, sobrenome, cpf, rg, email, senha } = req.body;

    const query = 'INSERT INTO Usuario (nome, sobrenome, email, senha, rg, cpf) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [nome, sobrenome, email, senha, rg, cpf], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar cliente:', error);
            res.status(500).json({ error: 'Erro ao cadastrar cliente' });
            return;
        }

        res.json({ success: true });
    });
});
app.post('/api/adicionar-produto', (req, res) => {
    const { emailUsuario, nomeProduto, precoProdutoBD, idProduto } = req.body;

    const query = 'INSERT INTO Carrinho (emailUsuario, nomeProduto, precoProduto, idProduto) VALUES (?, ?, ?, ?)';
    connection.query(query, [emailUsuario, nomeProduto, precoProdutoBD, idProduto], (error, results) => {
        if (error) {
            console.error('Erro ao adicionar produto:', error);
            res.status(500).json({ error: 'Erro ao adicionar produto' });
            return;
        }

        res.json({ success: true });
    });
});
app.post('/api/remover-produtos', (req, res) => {
    const { emailUsuario } = req.body;

    const query = 'DELETE FROM Carrinho WHERE emailUsuario = ?';
    connection.query(query, [emailUsuario], (error, results) => {
        if (error) {
            console.error('Erro ao remover produtos:', error);
            res.status(500).json({ error: 'Erro ao remover produtos' });
            return;
        }

        res.json({ success: true });
    });
});
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});