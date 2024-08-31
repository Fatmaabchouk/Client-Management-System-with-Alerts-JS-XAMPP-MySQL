const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Remplacez par votre mot de passe MySQL
    database: 'gestion_clients'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ajouter-client', (req, res) => {
    const nomClient = req.body.nom;
    connection.query('INSERT INTO clients (nom) VALUES (?)', [nomClient], (err, result) => {
        if (err) throw err;
        const clientId = result.insertId;
        console.log({ id: clientId, nom: nomClient }); // Vérifiez les données ici
        res.json({ id: clientId, nom: nomClient });
    });
});



app.get('/liste-clients', (req, res) => {
    connection.query('SELECT * FROM clients', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.post('/supprimer-client', (req, res) => {
    const clientId = req.body.id;
    connection.query('DELETE FROM clients WHERE id = ?', [clientId], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.post('/envoyer-alerte', (req, res) => {
    const { id, alerte_activee } = req.body;
    const nouvelleValeur = alerte_activee == 1 ? 1 : 0; // 1 pour activer, 0 pour désactiver
    connection.query('UPDATE clients SET alerte_envoyee = ? WHERE id = ?', [nouvelleValeur, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});


app.listen(3000, () => {
    console.log('Le serveur tourne sur le port 3000.');
});
