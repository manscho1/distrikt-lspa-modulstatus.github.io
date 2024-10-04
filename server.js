const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dummy-Daten für Benutzer und Module
let users = [
];

// Dummy-Daten für den Headowner
const headOwner = { name: 'localhost' };

// Route zum Überprüfen des Status eines Benutzers
app.get('/checkStatus', (req, res) => {
    const name = req.query.name;
    const result = users.filter(user => user.name.toLowerCase() === name.toLowerCase());
    res.json(result);
});

// Route zum Hinzufügen eines neuen Benutzers
app.post('/addUser', (req, res) => {
    const { name, paNumber } = req.body;
    const userExists = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (userExists) {
        return res.json({ message: `Benutzer ${name} existiert bereits.` });
    }

    users.push({ name, paNumber, completedModules: { aktenkunde: false, funktraining: false, personenkontrolle: false }, isAusbilder: false });
    res.json({ message: `Benutzer ${name} wurde hinzugefügt.` });
});

// Route zum Zuweisen von Ausbilderrollen
app.post('/assignAusbilder', (req, res) => {
    const { name } = req.body;
    const user = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (!user) {
        return res.json({ message: `Benutzer ${name} nicht gefunden.` });
    }

    user.isAusbilder = true;
    res.json({ message: `${name} wurde als Ausbilder hinzugefügt.` });
});

// Route zum Entfernen der Ausbilderrollen
app.post('/removeAusbilder', (req, res) => {
    const { name } = req.body;
    const user = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (!user) {
        return res.json({ message: `Benutzer ${name} nicht gefunden.` });
    }

    user.isAusbilder = false;
    res.json({ message: `Ausbilderrechte von ${name} wurden entfernt.` });
});


// Route zum Aktualisieren des Status eines Moduls
app.post('/updateStatus', (req, res) => {
    const { name, module, completed } = req.body;
    const user = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (!user) {
        return res.json({ message: `Benutzer ${name} nicht gefunden.` });
    }

    user.completedModules[module] = completed;
    res.json({ message: `Status von ${module} für ${name} wurde aktualisiert.` });
});

// Route zum Abrufen aller Benutzer
app.get('/allUsers', (req, res) => {
    res.json(users);
});



// Route zum Löschen eines Benutzers
app.post('/deleteUser', (req, res) => {
    const { name } = req.body;
    const userIndex = users.findIndex(user => user.name.toLowerCase() === name.toLowerCase());

    if (userIndex === -1) {
        return res.json({ message: `Benutzer ${name} nicht gefunden.` });
    }

    users.splice(userIndex, 1);
    res.json({ message: `Benutzer ${name} wurde gelöscht.` });
});

// Route zum Überprüfen des Headowner-Zugangs (nur für dich)
app.get('/isHeadOwner', (req, res) => {
    const currentHost = req.hostname;
    if (currentHost === headOwner.name) {
        res.json({ isHeadOwner: true });
    } else {
        res.json({ isHeadOwner: false });
    }
});

// Route zum Hinzufügen eines neuen Benutzers (inkl. Dienstnummer)
app.post('/addUser', (req, res) => {
    const { name, paNumber } = req.body;
    const userExists = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (userExists) {
        return res.json({ message: `Benutzer ${name} existiert bereits.` });
    }

    users.push({ name, paNumber, completedModules: { aktenkunde: false, funktraining: false, personenkontrolle: false }, isAdmin: false });
    res.json({ message: `Benutzer ${name} wurde hinzugefügt.` });
});



// Starten des Servers
app.listen(PORT, () => {
    console.log(`Server läuft unter http://localhost:${PORT}`);
});