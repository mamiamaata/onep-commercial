// =============================================
// LECTEUR DE BASE DE DONNÉES - GITHUB PAGES COMPATIBLE
// =============================================

class DatabaseReader {
    constructor() {
        this.dbType = 'json';
        this.isConnected = true;
    }

    // ==================== LECTURE JSON (LOCAL) ====================
    async readJSONDatabase() {
        try {
            const clients = JSON.parse(localStorage.getItem('onep_clients') || '[]');
            const commandes = JSON.parse(localStorage.getItem('onep_commandes') || '[]');
            const factures = JSON.parse(localStorage.getItem('onep_factures') || '[]');
            
            // Si pas de données, créer des exemples
            if (clients.length === 0) {
                const sampleData = {
                    clients: [
                        {
                            id: 1,
                            Nom: "Hotel Hilton Casablanca",
                            Email: "contact@hilton.com",
                            Telephone: "+212522123456",
                            Adresse: "Boulevard Mohamed Zerktouni",
                            Ville: "Casablanca",
                            DateCreation: new Date().toISOString()
                        }
                    ],
                    commandes: [
                        {
                            id: 1,
                            NumeroCommande: "CMD-2024-001",
                            ClientID: 1,
                            NomClient: "Hotel Hilton Casablanca",
                            Service: "Eau Professionnelle",
                            Quantite: 1,
                            Montant: 1200.00,
                            Statut: "En cours",
                            DateCommande: new Date().toISOString()
                        }
                    ],
                    factures: [
                        {
                            id: 1,
                            NumeroFacture: "FAC-2024-001",
                            CommandeID: 1,
                            NomClient: "Hotel Hilton Casablanca",
                            Montant: 1200.00,
                            DateEcheance: "2024-12-31",
                            StatutPaiement: "Impayée",
                            JoursRetard: 10
                        }
                    ]
                };
                
                localStorage.setItem('onep_clients', JSON.stringify(sampleData.clients));
                localStorage.setItem('onep_commandes', JSON.stringify(sampleData.commandes));
                localStorage.setItem('onep_factures', JSON.stringify(sampleData.factures));
                
                return {
                    success: true,
                    data: sampleData,
                    source: 'JSON Local',
                    message: 'Données d\'exemple créées avec succès!'
                };
            }
            
            return {
                success: true,
                data: {
                    clients: clients,
                    commandes: commandes,
                    factures: factures,
                    total: clients.length + commandes.length + factures.length
                },
                source: 'JSON Local',
                message: `${clients.length} clients, ${commandes.length} commandes, ${factures.length} factures chargées`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                source: 'JSON Local'
            };
        }
    }

    // ==================== SIMULATION MYSQL ====================
    async readMySQLDatabase() {
        try {
            await this.simulateDelay(800);
            
            return {
                success: true,
                data: {
                    clients: [
                        { id: 1, Nom: "Client MySQL 1", Email: "mysql1@example.com", Telephone: "+212 600 000 001" },
                        { id: 2, Nom: "Client MySQL 2", Email: "mysql2@example.com", Telephone: "+212 600 000 002" }
                    ],
                    commandes: [
                        { id: 1, NumeroCommande: "MYSQL-001", Montant: 1500, Service: "Eau Professionnelle" }
                    ],
                    factures: [
                        { id: 1, NumeroFacture: "FAC-MYSQL-001", Montant: 1500, StatutPaiement: "Payée" }
                    ]
                },
                source: 'MySQL (Simulation)',
                message: 'Simulation MySQL - Pour une vraie connexion, déployez sur un serveur avec base de données'
            };
        } catch (error) {
            return {
                success: false,
                error: 'MySQL simulation échouée',
                source: 'MySQL (Simulation)'
            };
        }
    }

    // ==================== SIMULATION MONGODB ====================
    async readMongoDBDatabase() {
        try {
            await this.simulateDelay(600);
            
            return {
                success: true,
                data: {
                    clients: [
                        { _id: "mongo1", Nom: "Client MongoDB 1", Email: "mongo1@example.com", Ville: "Casablanca" },
                        { _id: "mongo2", Nom: "Client MongoDB 2", Email: "mongo2@example.com", Ville: "Rabat" }
                    ],
                    commandes: [
                        { _id: "mongo1", NumeroCommande: "MONGO-001", Montant: 2000, Service: "Electricité Professionnelle" }
                    ],
                    factures: [
                        { _id: "mongo1", NumeroFacture: "FAC-MONGO-001", Montant: 2000, StatutPaiement: "En attente" }
                    ]
                },
                source: 'MongoDB (Simulation)',
                message: 'Simulation MongoDB - Compatible avec les applications modernes'
            };
        } catch (error) {
            return {
                success: false,
                error: 'MongoDB simulation échouée',
                source: 'MongoDB (Simulation)'
            };
        }
    }

    // ==================== LECTURE PRINCIPALE ====================
    async readDatabase(dbType = 'json') {
        this.dbType = dbType;

        switch(this.dbType) {
            case 'mysql':
                return await this.readMySQLDatabase();
            case 'mongodb':
                return await this.readMongoDBDatabase();
            case 'json':
            default:
                return await this.readJSONDatabase();
        }
    }

    // ==================== UTILITAIRES ====================
    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getSupportedDatabases() {
        return [
            { 
                id: 'json', 
                name: 'JSON Local', 
                description: 'Base de données locale (Fonctionne sur GitHub Pages)',
                icon: 'fa-database',
                color: '#3498db'
            },
            { 
                id: 'mysql', 
                name: 'MySQL', 
                description: 'Base de données relationnelle (Simulation)',
                icon: 'fa-database',
                color: '#007bff'
            },
            { 
                id: 'mongodb', 
                name: 'MongoDB', 
                description: 'Base de données NoSQL (Simulation)',
                icon: 'fa-leaf',
                color: '#47a447'
            }
        ];
    }
}

// =============================================
// INTERFACE UTILISATEUR
// =============================================

class DatabaseReaderUI {
    constructor() {
        this.reader = new DatabaseReader();
    }

    async showDatabaseReader() {
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'databaseReaderModal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3><i class="fas fa-network-wired"></i> Lecteur de Base de Données</h3>
                    <button class="close-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="database-selector">
                        <h4>🔌 Choisissez votre type de base de données:</h4>
                        <p class="selector-description">Cette démonstration montre la compatibilité avec différents systèmes de base de données</p>
                        <div class="db-options" id="dbOptions">
                            <!-- Les options seront générées ici -->
                        </div>
                    </div>
                    <div class="database-results">
                        <h4>📊 Résultats de la connexion:</h4>
                        <div id="dbReaderResults" class="db-results-container">
                            <div class="no-results">
                                <i class="fas fa-database" style="font-size: 3rem; color: #bdc3c7; margin-bottom: 15px;"></i>
                                <p>Sélectionnez une base de données pour voir les données</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="dbReaderUI.closeModal()">Fermer</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.populateDatabaseOptions();
        this.setupEventListeners();
        
        // Connecter automatiquement à JSON Local
        this.connectToDatabase('json');
    }

    populateDatabaseOptions() {
        const dbOptions = document.getElementById('dbOptions');
        const databases = this.reader.getSupportedDatabases();

        dbOptions.innerHTML = databases.map(db => `
            <div class="db-option" data-db-type="${db.id}" style="border-left: 4px solid ${db.color};">
                <div class="db-option-header">
                    <i class="fas ${db.icon}" style="color: ${db.color};"></i>
                    <h5>${db.name}</h5>
                </div>
                <p>${db.description}</p>
                <button class="btn btn-primary btn-sm connect-btn" data-db-type="${db.id}">
                    <i class="fas fa-plug"></i> Se Connecter
                </button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Bouton de fermeture
        document.querySelector('#databaseReaderModal .close-btn').onclick = () => {
            this.closeModal();
        };

        // Clic externe pour fermer
        document.getElementById('databaseReaderModal').onclick = (e) => {
            if (e.target.id === 'databaseReaderModal') {
                this.closeModal();
            }
        };

        // Boutons de connexion
        document.querySelectorAll('.connect-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const dbType = e.target.getAttribute('data-db-type');
                await this.connectToDatabase(dbType);
            };
        });
    }

    async connectToDatabase(dbType) {
        const resultsContainer = document.getElementById('dbReaderResults');
        resultsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner spinner"></i>
                <span>Connexion à ${dbType} en cours...</span>
            </div>
        `;

        try {
            const result = await this.reader.readDatabase(dbType);
            this.displayResults(result);
        } catch (error) {
            this.displayResults({
                success: false,
                error: error.message,
                source: dbType
            });
        }
    }

    displayResults(result) {
        const resultsContainer = document.getElementById('dbReaderResults');
        
        if (result.success) {
            resultsContainer.innerHTML = `
                <div class="success-result">
                    <div class="result-header success">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h5>✅ Connexion réussie</h5>
                            <small>Source: ${result.source}</small>
                        </div>
                    </div>
                    
                    ${result.message ? `
                        <div class="alert alert-success">
                            <i class="fas fa-info-circle"></i>
                            ${result.message}
                        </div>
                    ` : ''}
                    
                    <div class="result-stats">
                        <div class="stat">
                            <span class="stat-value">${result.data.clients.length}</span>
                            <span class="stat-label">Clients</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${result.data.commandes.length}</span>
                            <span class="stat-label">Commandes</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${result.data.factures ? result.data.factures.length : 0}</span>
                            <span class="stat-label">Factures</span>
                        </div>
                    </div>

                    <div class="sample-data">
                        <h6>📋 Aperçu des données:</h6>
                        <div class="data-preview">
                            <pre>${JSON.stringify(result.data, null, 2)}</pre>
                        </div>
                    </div>

                    ${result.source.includes('Simulation') ? `
                        <div class="info-box">
                            <h6><i class="fas fa-lightbulb"></i> Information</h6>
                            <p>Ceci est une simulation. Pour une vraie connexion MySQL/MongoDB, déployez l'application sur un serveur avec base de données.</p>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="error-result">
                    <div class="result-header error">
                        <i class="fas fa-exclamation-circle"></i>
                        <div>
                            <h5>❌ Erreur de connexion</h5>
                            <small>Source: ${result.source}</small>
                        </div>
                    </div>
                    
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        ${result.error}
                    </div>

                    <div class="error-help">
                        <h6><i class="fas fa-wrench"></i> Résolution de problèmes:</h6>
                        <ul>
                            <li>Vérifiez la connexion Internet</li>
                            <li>Les simulations fonctionnent sans configuration</li>
                            <li>JSON Local utilise le stockage du navigateur</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    closeModal() {
        const modal = document.getElementById('databaseReaderModal');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialiser le lecteur UI
const dbReaderUI = new DatabaseReaderUI();