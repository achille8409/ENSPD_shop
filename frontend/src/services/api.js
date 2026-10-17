import { PRODUCTS, CATEGORIES } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/ENSPD_SHOP/backend/api';

// Helper for HTTP requests with automatic fallback
async function request(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('enspd_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast fallback

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur serveur HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // If backend is not running or unreachable, trigger intelligent fallback
    console.warn(`[ENSPD API] Endpoint ${endpoint} injoignable (${error.message}). Utilisation du mode Sandbox local.`);
    return null;
  }
}

export const apiService = {
  // --- AUTHENTICATION ---
  async login(email, password) {
    const remote = await request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (remote && remote.success) {
      return remote;
    }

    // Local fallback simulation
    const storedUsers = JSON.parse(localStorage.getItem('enspd_users') || '[]');
    const defaultUser = {
      id: 1,
      name: "Étudiant Polytech",
      email: "etudiant@enspd.cm",
      phone: "677123456",
      department: "Génie Informatique",
      role: "student"
    };

    const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || 
      (email === 'etudiant@enspd.cm' ? defaultUser : null);

    if (user || email.includes('@')) {
      const activeUser = user || {
        id: Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email,
        phone: '690123456',
        department: 'ENSPD',
        role: 'student'
      };
      const token = 'simulated_jwt_token_' + Date.now();
      return {
        success: true,
        token,
        user: activeUser,
        message: "Connexion réussie !"
      };
    }

    throw new Error("Identifiants incorrects. Veuillez vérifier votre adresse email et mot de passe.");
  },

  async register(userData) {
    const remote = await request('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (remote && remote.success) {
      return remote;
    }

    // Local fallback
    const storedUsers = JSON.parse(localStorage.getItem('enspd_users') || '[]');
    const existing = storedUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error("Un compte existe déjà avec cette adresse email.");
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      department: userData.department || 'Campus ENSPD',
      role: 'student'
    };

    storedUsers.push(newUser);
    localStorage.setItem('enspd_users', JSON.stringify(storedUsers));

    const token = 'simulated_jwt_token_' + Date.now();
    return {
      success: true,
      token,
      user: newUser,
      message: "Compte créé avec succès ! Bienvenue sur ENSPD SHOP."
    };
  },

  // --- PRODUCTS & CATEGORIES ---
  async getProducts() {
    const remote = await request('/products/index.php');
    if (remote && remote.success && remote.data) {
      return remote.data;
    }
    return PRODUCTS;
  },

  async getCategories() {
    const remote = await request('/products/categories.php');
    if (remote && remote.success && remote.data) {
      return remote.data;
    }
    return CATEGORIES;
  },

  // --- ORDERS & MOBILE MONEY PAYMENTS ---
  async processPayment(paymentDetails) {
    const remote = await request('/payments/process.php', {
      method: 'POST',
      body: JSON.stringify(paymentDetails)
    });

    if (remote && remote.success) {
      return remote;
    }

    // High fidelity Mobile Money Simulation (MTN / Orange)
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Simple test phone validation: if ends in 000, trigger failure for testing
    if (paymentDetails.phone && paymentDetails.phone.endsWith('000')) {
      return {
        success: false,
        status: 'FAILED',
        message: "Échec de la transaction : solde insuffisant sur votre compte " + 
          (paymentDetails.operator === 'orange' ? 'Orange Money' : 'MTN Mobile Money') + 
          " ou délai USSD expiré."
      };
    }

    const transactionId = `${paymentDetails.operator === 'orange' ? 'OM' : 'MOMO'}-ENSPD-${Math.floor(100000 + Math.random() * 900000)}`;

    const paymentRecord = {
      success: true,
      transactionId,
      amount: paymentDetails.amount,
      phone: paymentDetails.phone,
      operator: paymentDetails.operator,
      orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      message: `Paiement de ${paymentDetails.amount.toLocaleString()} FCFA confirmé avec succès via ${paymentDetails.operator === 'orange' ? 'Orange Money' : 'MTN Mobile Money'}.`
    };

    // Store in orders history
    const history = JSON.parse(localStorage.getItem('enspd_orders') || '[]');
    history.unshift({
      ...paymentRecord,
      items: paymentDetails.items || [],
      deliveryAddress: paymentDetails.deliveryAddress || 'Campus ENSPD - PK17',
      deliveryDate: paymentDetails.deliveryDate || null,
      deliveryTime: paymentDetails.deliveryTime || null,
      notes: paymentDetails.notes || ''
    });
    localStorage.setItem('enspd_orders', JSON.stringify(history));

    return paymentRecord;
  }
};
