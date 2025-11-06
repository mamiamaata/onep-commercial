// =============================================
// قاعدة البيانات مع LocalStorage
// =============================================

class Database {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        // إذا لم توجد بيانات، أنشئ بيانات تجريبية
        if (!localStorage.getItem('onep_clients')) {
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
                    },
                    {
                        id: 2,
                        Nom: "Restaurant La Sqala",
                        Email: "info@lasqala.ma",
                        Telephone: "+212522234567",
                        Adresse: "Boulevard des Almohades",
                        Ville: "Casablanca",
                        DateCreation: new Date().toISOString()
                    },
                    {
                        id: 3,
                        Nom: "Marjane Ain Sebaa",
                        Email: "achat@marjane.ma",
                        Telephone: "+212522345678",
                        Adresse: "Route de Rabat",
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
                        DateCommande: new Date().toISOString(),
                        Notes: ""
                    },
                    {
                        id: 2,
                        NumeroCommande: "CMD-2024-002",
                        ClientID: 2,
                        NomClient: "Restaurant La Sqala",
                        Service: "Electricité Professionnelle",
                        Quantite: 1,
                        Montant: 2500.00,
                        Statut: "Livrée",
                        DateCommande: new Date().toISOString(),
                        Notes: "Installation complète"
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
                    },
                    {
                        id: 2,
                        NumeroFacture: "FAC-2024-002",
                        CommandeID: 2,
                        NomClient: "Restaurant La Sqala",
                        Montant: 2500.00,
                        DateEcheance: "2024-12-25",
                        StatutPaiement: "Impayée",
                        JoursRetard: 5
                    }
                ]
            };
            
            this.saveData(sampleData);
        }
    }

    saveData(data) {
        if (data.clients) localStorage.setItem('onep_clients', JSON.stringify(data.clients));
        if (data.commandes) localStorage.setItem('onep_commandes', JSON.stringify(data.commandes));
        if (data.factures) localStorage.setItem('onep_factures', JSON.stringify(data.factures));
    }

    // ==================== العملاء ====================
    async getClients() {
        return new Promise((resolve) => {
            const clients = JSON.parse(localStorage.getItem('onep_clients')) || [];
            resolve(clients);
        });
    }

    async addClient(clientData) {
        return new Promise((resolve) => {
            const clients = JSON.parse(localStorage.getItem('onep_clients')) || [];
            const newClient = {
                id: Date.now(),
                ...clientData,
                DateCreation: new Date().toISOString()
            };
            clients.push(newClient);
            localStorage.setItem('onep_clients', JSON.stringify(clients));
            resolve(newClient);
        });
    }

    async updateClient(clientID, clientData) {
        return new Promise((resolve) => {
            const clients = JSON.parse(localStorage.getItem('onep_clients')) || [];
            const index = clients.findIndex(c => c.id == clientID);
            if (index !== -1) {
                clients[index] = { ...clients[index], ...clientData };
                localStorage.setItem('onep_clients', JSON.stringify(clients));
                resolve(true);
            }
            resolve(false);
        });
    }

    async deleteClient(clientID) {
        return new Promise((resolve) => {
            let clients = JSON.parse(localStorage.getItem('onep_clients')) || [];
            clients = clients.filter(c => c.id != clientID);
            localStorage.setItem('onep_clients', JSON.stringify(clients));
            resolve(true);
        });
    }

    // ==================== الطلبات ====================
    async getCommandes() {
        return new Promise((resolve) => {
            const commandes = JSON.parse(localStorage.getItem('onep_commandes')) || [];
            resolve(commandes);
        });
    }

    async addCommande(commandeData) {
        return new Promise((resolve) => {
            const commandes = JSON.parse(localStorage.getItem('onep_commandes')) || [];
            const clients = JSON.parse(localStorage.getItem('onep_clients')) || [];
            const client = clients.find(c => c.id == commandeData.clientID);
            
            const newCommande = {
                id: Date.now(),
                NumeroCommande: 'CMD-' + new Date().getFullYear() + '-' + (commandes.length + 1).toString().padStart(3, '0'),
                ClientID: parseInt(commandeData.clientID),
                NomClient: client ? client.Nom : 'Client Inconnu',
                Service: commandeData.service,
                Quantite: commandeData.quantite || 1,
                Montant: commandeData.montant,
                Statut: 'En cours',
                DateCommande: new Date().toISOString(),
                Notes: commandeData.notes || ''
            };
            
            commandes.push(newCommande);
            localStorage.setItem('onep_commandes', JSON.stringify(commandes));
            resolve(newCommande);
        });
    }

    // ==================== الفواتير ====================
    async getFactures() {
        return new Promise((resolve) => {
            const factures = JSON.parse(localStorage.getItem('onep_factures')) || [];
            resolve(factures);
        });
    }

    async markAsPaid(factureID) {
        return new Promise((resolve) => {
            const factures = JSON.parse(localStorage.getItem('onep_factures')) || [];
            const index = factures.findIndex(f => f.id == factureID);
            if (index !== -1) {
                factures[index].StatutPaiement = 'Payée';
                localStorage.setItem('onep_factures', JSON.stringify(factures));
                resolve(true);
            }
            resolve(false);
        });
    }
}

// إنشاء قاعدة البيانات
const db = new Database();

// =============================================
// دوال مساعدة
// =============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeSingleQuotes(text) {
    if (!text) return '';
    return text.replace(/'/g, "\\'");
}

function unescapeSingleQuotes(text) {
    if (!text) return '';
    return text.replace(/\\'/g, "'");
}

function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// =============================================
// إدارة النافذة المنبثقة
// =============================================

function openModal() {
    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// =============================================
// التنقل بين الأقسام
// =============================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-links li');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    
    const titles = {
        'dashboard': 'Tableau de Bord Commercial',
        'clients': 'Gestion des Clients',
        'commandes': 'Gestion des Commandes',
        'recouvrement': 'Module de Recouvrement'
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            pageTitle.textContent = titles[tabId];
            
            loadTabData(tabId);
        });
    });
}

function loadTabData(tabId) {
    switch(tabId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'clients':
            loadClients();
            break;
        case 'commandes':
            loadOrders();
            break;
        case 'recouvrement':
            loadRecouvrement();
            break;
    }
}

// =============================================
// لوحة التحكم
// =============================================

async function loadDashboard() {
    try {
        const clients = await db.getClients();
        const orders = await db.getCommandes();
        
        document.getElementById('total-clients').textContent = clients.length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.Montant || 0), 0);
        document.getElementById('total-revenue').textContent = formatNumber(totalRevenue) + ' DH';
        
        const activeOrders = orders.filter(o => o.Statut === 'En cours').length;
        document.getElementById('active-orders').textContent = activeOrders;
        
        const overdueAmount = orders
            .filter(o => o.Statut === 'En cours')
            .reduce((sum, order) => sum + parseFloat(order.Montant || 0), 0);
        document.getElementById('overdue-amount').textContent = formatNumber(overdueAmount) + ' DH';
        
        const tbody = document.getElementById('recent-orders');
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #666;">Aucune commande récente</td></tr>';
        } else {
            const recentOrders = orders.slice(0, 5);
            tbody.innerHTML = recentOrders.map(order => `
                <tr>
                    <td><strong>${escapeHtml(order.NumeroCommande)}</strong></td>
                    <td>${escapeHtml(order.NomClient)}</td>
                    <td>${escapeHtml(order.Service)}</td>
                    <td><strong>${formatNumber(parseFloat(order.Montant))} DH</strong></td>
                    <td>
                        <span class="badge ${order.Statut === 'Livrée' ? 'badge-success' : order.Statut === 'En cours' ? 'badge-warning' : 'badge-danger'}">
                            <span class="status-indicator ${order.Statut === 'Livrée' ? 'status-active' : order.Statut === 'En cours' ? 'status-pending' : 'status-inactive'}"></span>
                            ${order.Statut}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur dashboard:', error);
        showToast('Erreur lors du chargement du tableau de bord', 'error');
    }
}

// =============================================
// إدارة العملاء
// =============================================

async function loadClients() {
    try {
        const clients = await db.getClients();
        const tbody = document.getElementById('clients-list');
        
        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #666;">Aucun client enregistré</td></tr>';
        } else {
            tbody.innerHTML = clients.map(client => `
                <tr>
                    <td><strong>${escapeHtml(client.Nom)}</strong></td>
                    <td>${escapeHtml(client.Email)}</td>
                    <td>${escapeHtml(client.Telephone || '-')}</td>
                    <td>${escapeHtml(client.Adresse || '-')}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-sm" onclick="editClient(${client.id}, '${escapeSingleQuotes(client.Nom)}', '${escapeSingleQuotes(client.Email)}', '${escapeSingleQuotes(client.Telephone || '')}', '${escapeSingleQuotes(client.Adresse || '')}')">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteClient(${client.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur clients:', error);
        showToast('Erreur lors du chargement des clients', 'error');
    }
}

// إضافة عميل
document.getElementById('client-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-client');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Enregistrement...';
        submitBtn.disabled = true;
        
        const clientData = {
            Nom: document.getElementById('client-name').value.trim(),
            Email: document.getElementById('client-email').value.trim(),
            Telephone: document.getElementById('client-phone').value.trim(),
            Adresse: document.getElementById('client-address').value.trim(),
            Ville: 'Casablanca'
        };
        
        if (!clientData.Nom) {
            throw new Error('Le nom est obligatoire');
        }
        if (!clientData.Email) {
            throw new Error('L\'email est obligatoire');
        }
        
        const newClient = await db.addClient(clientData);
        showToast('Client ajouté avec succès!');
        document.getElementById('client-form').reset();
        await loadClients();
        await loadClientsForOrders();
        await loadDashboard();
        
    } catch (error) {
        console.error('Erreur ajout client:', error);
        showToast('Erreur: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// تعديل عميل
function editClient(id, nom, email, telephone, adresse) {
    const decodedNom = unescapeSingleQuotes(nom);
    const decodedEmail = unescapeSingleQuotes(email);
    const decodedTelephone = unescapeSingleQuotes(telephone);
    const decodedAdresse = unescapeSingleQuotes(adresse);
    
    document.getElementById('edit-client-id').value = id;
    document.getElementById('edit-client-name').value = decodedNom;
    document.getElementById('edit-client-email').value = decodedEmail;
    document.getElementById('edit-client-phone').value = decodedTelephone;
    document.getElementById('edit-client-address').value = decodedAdresse;
    
    openModal();
}

async function updateClient() {
    const updateBtn = document.getElementById('update-client-btn');
    const originalText = updateBtn.innerHTML;
    
    try {
        updateBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Enregistrement...';
        updateBtn.disabled = true;
        
        const clientData = {
            Nom: document.getElementById('edit-client-name').value.trim(),
            Email: document.getElementById('edit-client-email').value.trim(),
            Telephone: document.getElementById('edit-client-phone').value.trim(),
            Adresse: document.getElementById('edit-client-address').value.trim(),
            Ville: 'Casablanca'
        };
        
        if (!clientData.Nom) throw new Error('Le nom est obligatoire');
        if (!clientData.Email) throw new Error('L\'email est obligatoire');
        
        const success = await db.updateClient(document.getElementById('edit-client-id').value, clientData);
        
        if (success) {
            showToast('Client modifié avec succès!');
            closeModal();
            await loadClients();
            await loadClientsForOrders();
        } else {
            throw new Error('Client non trouvé');
        }
    } catch (error) {
        console.error('Erreur modification client:', error);
        showToast('Erreur: ' + error.message, 'error');
    } finally {
        updateBtn.innerHTML = originalText;
        updateBtn.disabled = false;
    }
}

// حذف عميل
async function deleteClient(clientID) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
        return;
    }
    
    try {
        const success = await db.deleteClient(clientID);
        
        if (success) {
            showToast('Client supprimé avec succès!');
            await loadClients();
            await loadClientsForOrders();
            await loadDashboard();
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur suppression client:', error);
        showToast('Erreur: ' + error.message, 'error');
    }
}

// =============================================
// إدارة الطلبات
// =============================================

async function loadClientsForOrders() {
    try {
        const clients = await db.getClients();
        const select = document.getElementById('order-client');
        
        select.innerHTML = '<option value="">Sélectionner un client</option>' +
            clients.map(client => 
                `<option value="${client.id}">${escapeHtml(client.Nom)}</option>`
            ).join('');
    } catch (error) {
        console.error('Erreur chargement clients:', error);
    }
}

async function loadOrders() {
    try {
        const orders = await db.getCommandes();
        const tbody = document.getElementById('orders-list');
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #666;">Aucune commande</td></tr>';
        } else {
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td><strong>${escapeHtml(order.NumeroCommande)}</strong></td>
                    <td>${escapeHtml(order.NomClient)}</td>
                    <td>${escapeHtml(order.Service)}</td>
                    <td><strong>${formatNumber(parseFloat(order.Montant))} DH</strong></td>
                    <td>${new Date(order.DateCommande).toLocaleDateString('fr-FR')}</td>
                    <td>
                        <span class="badge ${order.Statut === 'Livrée' ? 'badge-success' : order.Statut === 'En cours' ? 'badge-warning' : 'badge-danger'}">
                            <span class="status-indicator ${order.Statut === 'Livrée' ? 'status-active' : order.Statut === 'En cours' ? 'status-pending' : 'status-inactive'}"></span>
                            ${order.Statut}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur commandes:', error);
        showToast('Erreur lors du chargement des commandes', 'error');
    }
}

// إنشاء طلب
document.getElementById('order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-order');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Création...';
        submitBtn.disabled = true;
        
        const servicePrices = {
            'Eau Résidentielle': 250,
            'Eau Professionnelle': 800,
            'Electricité Résidentielle': 350,
            'Electricité Professionnelle': 1200
        };
        
        const selectedService = document.getElementById('order-service').value;
        const quantity = parseInt(document.getElementById('order-quantity').value) || 1;
        const montant = servicePrices[selectedService] * quantity;
        
        const orderData = {
            clientID: document.getElementById('order-client').value,
            service: selectedService,
            quantite: quantity,
            montant: montant,
            notes: document.getElementById('order-notes').value
        };
        
        if (!orderData.clientID) throw new Error('Veuillez sélectionner un client');
        if (!orderData.service) throw new Error('Veuillez sélectionner un service');
        
        const newOrder = await db.addCommande(orderData);
        showToast(`Commande créée: ${newOrder.NumeroCommande}`);
        document.getElementById('order-form').reset();
        await loadOrders();
        await loadDashboard();
        
    } catch (error) {
        console.error('Erreur création commande:', error);
        showToast('Erreur: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// =============================================
// إدارة التحصيل
// =============================================

async function loadRecouvrement() {
    try {
        const factures = await db.getFactures();
        
        document.getElementById('overdue-count').textContent = factures.length;
        
        const totalAmount = factures.reduce((sum, facture) => sum + parseFloat(facture.Montant || 0), 0);
        document.getElementById('overdue-total').textContent = formatNumber(totalAmount) + ' DH';
        
        const uniqueClients = [...new Set(factures.map(f => f.NomClient))];
        document.getElementById('overdue-clients').textContent = uniqueClients.length;
        
        const tbody = document.getElementById('overdue-invoices');
        if (factures.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #666;">Aucune facture en retard</td></tr>';
        } else {
            tbody.innerHTML = factures.map(facture => `
                <tr>
                    <td><strong>${escapeHtml(facture.NumeroFacture)}</strong></td>
                    <td>${escapeHtml(facture.NomClient)}</td>
                    <td>${new Date(facture.DateEcheance).toLocaleDateString('fr-FR')}</td>
                    <td>
                        <span class="badge badge-danger">
                            ${facture.JoursRetard} jour${facture.JoursRetard > 1 ? 's' : ''}
                        </span>
                    </td>
                    <td><strong>${formatNumber(parseFloat(facture.Montant))} DH</strong></td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="markAsPaid(${facture.id})">
                            <i class="fas fa-check"></i> Marquer Payée
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur recouvrement:', error);
        showToast('Erreur lors du chargement du recouvrement', 'error');
    }
}

// تعليم كمدفوع
async function markAsPaid(factureID) {
    if (!confirm('Marquer cette facture comme payée ? Cette action mettra à jour son statut.')) {
        return;
    }
    
    try {
        const success = await db.markAsPaid(factureID);
        
        if (success) {
            showToast('Facture marquée comme payée!');
            await loadRecouvrement();
        } else {
            throw new Error('Facture non trouvée');
        }
    } catch (error) {
        console.error('Erreur paiement facture:', error);
        showToast('Erreur: ' + error.message, 'error');
    }
}

// =============================================
// التهيئة
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    loadClientsForOrders();
    loadDashboard();
    
    loadClients();
    loadOrders();
    loadRecouvrement();
    
    console.log('Application ONEP Commercial initialisée avec succès');
});

window.addEventListener('error', function(e) {
    console.error('Erreur globale:', e.error);
    showToast('Une erreur inattendue est survenue', 'error');
});