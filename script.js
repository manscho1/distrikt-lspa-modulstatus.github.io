// Überprüfen, ob der Benutzer der Headowner ist, um Ausbilderrechte zu verwalten
let isHeadOwner = false;

fetch('/isHeadOwner')
    .then(response => response.json())
    .then(data => {
        isHeadOwner = data.isHeadOwner;
        if (isHeadOwner) {
            document.getElementById('addUserContainer').style.display = 'block'; // Zeigt das Hinzufügen von Benutzern nur für Ausbilder an
        }
    });

// Funktion zum Anzeigen aller Benutzer
function loadAllUsers() {
    fetch(`/allUsers`)
        .then(response => response.json())
        .then(data => {
            const allUsersDiv = document.getElementById('allUsers');
            allUsersDiv.innerHTML = '';

            data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.innerHTML = `
                    <p class="user-name" onclick="showUserModules('${user.name}')">${user.name} - ${user.isAdmin ? 'Admin' : 'User'}</p>
                    ${user.isAdmin ? '' : `<button onclick="deleteUser('${user.name}')">Löschen</button>`}
                `;
                allUsersDiv.appendChild(userDiv);

                // Option zur Zuweisung von Adminrechten, nur für den Headowner
                if (isHeadOwner && !user.isAdmin) {
                    const assignAdminButton = document.createElement('button');
                    assignAdminButton.innerText = `Mache ${user.name} zum Admin`;
                    assignAdminButton.onclick = () => assignAdmin(user.name);
                    allUsersDiv.appendChild(assignAdminButton);
                }
            });
        });
}

// Funktion zur Anzeige der Module eines Benutzers
function showUserModules(name) {
    fetch(`/checkStatus?name=${name}`)
        .then(response => response.json())
        .then(data => {
            const user = data[0];
            const modulesDiv = document.getElementById('modules');
            modulesDiv.innerHTML = '';

            Object.keys(user.completedModules).forEach(module => {
                const moduleStatus = user.completedModules[module];
                const statusColor = moduleStatus ? 'green' : 'red';
                const statusText = moduleStatus ? 'Abgeschlossen' : 'Nicht abgeschlossen';

                const moduleDiv = document.createElement('div');
                moduleDiv.innerHTML = `
                    <p>${module} - <span style="color:${statusColor}">${statusText}</span></p>
                    ${user.isAdmin ? `<button onclick="updateStatus('${user.name}', '${module}', ${!moduleStatus})">
                        Markiere als ${moduleStatus ? 'nicht abgeschlossen' : 'abgeschlossen'}
                    </button>` : ''}
                `;
                modulesDiv.appendChild(moduleDiv);
            });
        });
}

// Statusaktualisierung
function updateStatus(name, module, completed) {
    fetch(`/updateStatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, module, completed }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        showUserModules(name); // Aktualisiere die Modulansicht
    });
}

// Benutzer löschen
function deleteUser(name) {
    fetch(`/deleteUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadAllUsers(); // Aktualisiere die Liste aller Benutzer
    });
}

function assignAusbilder(name) {
    fetch(`/assignAusbilder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadAllUsers();
    });
}

function removeAusbilder(name) {
    fetch(`/removeAusbilder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadAllUsers();
    });
}

// Benutzer hinzufügen
document.getElementById('addUserButton').addEventListener('click', function() {
    const name = document.getElementById('newUserName').value;
    if (name) {
        fetch(`/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('newUserName').value = '';
            loadAllUsers(); // Liste aller Benutzer aktualisieren
        });
    } else {
        alert('Bitte gib einen Namen ein.');
    }
});

// Benutzer hinzufügen (inkl. Dienstnummer)
document.getElementById('addUserButton').addEventListener('click', function() {
    const name = document.getElementById('newUserName').value;
    const paNumber = document.getElementById('newUserPANumber').value;

    if (name && paNumber) {
        fetch(`/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, paNumber }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserPANumber').value = '';
            loadAllUsers(); // Liste aller Benutzer aktualisieren
        });
    } else {
        alert('Bitte gib einen Namen und eine Dienstnummer ein.');
    }
});



// Aktualisierte Funktion zum Laden aller Benutzer
function loadAllUsers() {
    fetch(`/allUsers`)
        .then(response => response.json())
        .then(data => {
            const allUsersDiv = document.getElementById('allUsers');
            allUsersDiv.innerHTML = '';

            data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.innerHTML = `
                    <p class="user-name" onclick="showUserModules('${user.name}')">PA: ${user.paNumber} - ${user.name} - ${user.isAdmin ? 'Admin' : 'User'}</p>
                    ${user.isAdmin ? `<button onclick="removeAdmin('${user.name}')">Adminrechte entfernen</button>` : `<button onclick="deleteUser('${user.name}')">Löschen</button>`}
                `;
                allUsersDiv.appendChild(userDiv);

                if (isHeadOwner && !user.isAdmin) {
                    const assignAdminButton = document.createElement('button');
                    assignAdminButton.innerText = `Mache ${user.name} zum Admin`;
                    assignAdminButton.onclick = () => assignAdmin(user.name);
                    allUsersDiv.appendChild(assignAdminButton);
                }
            });
        });
}


// Benutzersuche
document.getElementById('searchButton').addEventListener('click', function() {
    const name = document.getElementById('searchInput').value;
    fetch(`/checkStatus?name=${name}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            if (data.length === 0) {
                resultsDiv.innerHTML = 'Keine Ergebnisse gefunden.';
                return;
            }

            data.forEach(person => {
                const personDiv = document.createElement('div');
                personDiv.innerHTML = `
                    <p>${person.name} - Status: <span>${person.completedModules.funktraining ? 'Abgeschlossen' : 'Nicht abgeschlossen'}</span></p>
                `;
                resultsDiv.appendChild(personDiv);
            });
        });
});

// Initiale Überprüfung, ob der Benutzer Adminrechte hat
function checkAdminStatus() {
    fetch('/isHeadOwner')
        .then(response => response.json())
        .then(data => {
            isHeadOwner = data.isHeadOwner;
            if (isHeadOwner) {
                document.getElementById('addUserContainer').style.display = 'block';
            }
        });
}

// Initiale Liste und Admin-Status laden
checkAdminStatus();
loadAllUsers();




// Initiale Liste laden
loadAllUsers();
