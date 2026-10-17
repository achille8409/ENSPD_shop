/**
 * Service de Journalisation et de Suivi d'Activités ENSPD SHOP
 * Enregistre : connexions, inscriptions, ajouts au panier, commandes et paiements
 */

const STORAGE_KEY = 'enspd_activity_logs';

export const ACTIVITY_TYPES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  CART_ADD: 'CART_ADD',
  CART_REMOVE: 'CART_REMOVE',
  ORDER: 'ORDER',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILED: 'PAYMENT_FAILED'
};

// Initial demo logs to showcase the dashboard immediately
const INITIAL_DEMO_LOGS = [
  {
    id: 'log-1',
    type: ACTIVITY_TYPES.PAYMENT_SUCCESS,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    userName: 'Emmanuel Ndongo',
    userEmail: 'emmanuel.ndongo@enspd.cm',
    userPhone: '677458921',
    details: 'Paiement de 18 500 FCFA validé via MTN MoMo pour "Calculatrice Casio FX-991CW ClassWiz"',
    meta: {
      amount: 18500,
      operator: 'mtn',
      transactionId: 'MOMO-ENSPD-849102',
      itemsCount: 1
    }
  },
  {
    id: 'log-2',
    type: ACTIVITY_TYPES.ORDER,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userName: 'Emmanuel Ndongo',
    userEmail: 'emmanuel.ndongo@enspd.cm',
    userPhone: '677458921',
    details: 'Commande #ORD-ENSPD-4819 passée pour 18 500 FCFA (Retrait Foyer des Étudiants PK17)',
    meta: {
      orderId: 'ORD-ENSPD-4819',
      total: 18500,
      items: ['Calculatrice Casio FX-991CW ClassWiz']
    }
  },
  {
    id: 'log-3',
    type: ACTIVITY_TYPES.CART_ADD,
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    userName: 'Sandrine Kengne',
    userEmail: 'sandrine.kengne@enspd.cm',
    userPhone: '699214578',
    details: 'A ajouté 1x "Hoodie Officiel ENSPD \'Polytech Spirit\'" (14 000 FCFA) à son panier',
    meta: {
      productName: 'Hoodie Officiel ENSPD "Polytech Spirit"',
      price: 14000,
      quantity: 1
    }
  },
  {
    id: 'log-4',
    type: ACTIVITY_TYPES.LOGIN,
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    userName: 'Sandrine Kengne',
    userEmail: 'sandrine.kengne@enspd.cm',
    userPhone: '699214578',
    details: 'Connexion réussie depuis le Campus de PK17',
    meta: {
      department: 'Classes Préparatoires 2'
    }
  },
  {
    id: 'log-5',
    type: ACTIVITY_TYPES.REGISTER,
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    userName: 'Cédric Mballa',
    userEmail: 'cedric.mballa@enspd.cm',
    userPhone: '651865028',
    details: 'Création d\'un nouveau compte étudiant (Filière: Génie Mécanique)',
    meta: {
      department: 'Génie Mécanique',
      phone: '651865028'
    }
  }
];

export const activityLogger = {
  getLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LOGS));
        return INITIAL_DEMO_LOGS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_LOGS;
    }
  },

  logEvent(type, userName, userEmail, userPhone, details, meta = {}) {
    const newEntry = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      timestamp: new Date().toISOString(),
      userName: userName || 'Visiteur Anonyme',
      userEmail: userEmail || 'Non renseigné',
      userPhone: userPhone || 'Non renseigné',
      details,
      meta
    };

    const currentLogs = this.getLogs();
    const updated = [newEntry, ...currentLogs];
    
    // Keep last 300 logs
    if (updated.length > 300) {
      updated.length = 300;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erreur enregistrement log', e);
    }

    // Try posting to backend if reachable
    fetch('http://localhost/ENSPD_SHOP/backend/api/admin/activities.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    }).catch(() => {});

    return newEntry;
  },

  clearLogs() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
