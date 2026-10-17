import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  LogIn, 
  ShoppingBag, 
  PackageCheck, 
  CreditCard, 
  Search, 
  RotateCcw, 
  Download, 
  Trash2, 
  Sparkles, 
  Filter, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle,
  ShieldCheck,
  ArrowUpRight,
  Calendar,
  Truck
} from 'lucide-react';
import { activityLogger, ACTIVITY_TYPES } from '../services/activityLogger';

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const refreshLogs = () => {
    setLogs(activityLogger.getLogs());
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    refreshLogs();
    // Auto-refresh every 5 seconds for live feel
    const interval = setInterval(refreshLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Voulez-vous vraiment effacer l'historique des activités ?")) {
      activityLogger.clearLogs();
      refreshLogs();
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `enspd_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // KPIs Calculations
  const stats = useMemo(() => {
    const registrations = logs.filter(l => l.type === ACTIVITY_TYPES.REGISTER).length;
    const logins = logs.filter(l => l.type === ACTIVITY_TYPES.LOGIN).length;
    const cartAdds = logs.filter(l => l.type === ACTIVITY_TYPES.CART_ADD).length;
    const orders = logs.filter(l => l.type === ACTIVITY_TYPES.ORDER).length;
    const successfulPayments = logs.filter(l => l.type === ACTIVITY_TYPES.PAYMENT_SUCCESS);
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + (p.meta?.amount || 0), 0);

    return {
      registrations,
      logins,
      cartAdds,
      orders,
      successfulPaymentsCount: successfulPayments.length,
      totalRevenue
    };
  }, [logs]);

  // Filtering logs by active tab and search query
  const filteredLogs = useMemo(() => {
    return logs.filter(item => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'LOGIN') matchesTab = item.type === ACTIVITY_TYPES.LOGIN;
      else if (activeTab === 'REGISTER') matchesTab = item.type === ACTIVITY_TYPES.REGISTER;
      else if (activeTab === 'CART') matchesTab = item.type === ACTIVITY_TYPES.CART_ADD || item.type === ACTIVITY_TYPES.CART_REMOVE;
      else if (activeTab === 'ORDER') matchesTab = item.type === ACTIVITY_TYPES.ORDER;
      else if (activeTab === 'PAYMENT') matchesTab = item.type === ACTIVITY_TYPES.PAYMENT_SUCCESS || item.type === ACTIVITY_TYPES.PAYMENT_FAILED;

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (item.userName && item.userName.toLowerCase().includes(q)) ||
        (item.userEmail && item.userEmail.toLowerCase().includes(q)) ||
        (item.userPhone && item.userPhone.includes(q)) ||
        (item.details && item.details.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [logs, activeTab, searchQuery]);

  const getEventBadge = (type) => {
    switch (type) {
      case ACTIVITY_TYPES.LOGIN:
        return {
          label: 'Connexion',
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: LogIn
        };
      case ACTIVITY_TYPES.REGISTER:
        return {
          label: 'Nouveau Compte',
          color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          icon: Users
        };
      case ACTIVITY_TYPES.CART_ADD:
        return {
          label: 'Ajout Panier',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: ShoppingBag
        };
      case ACTIVITY_TYPES.CART_REMOVE:
        return {
          label: 'Retrait Panier',
          color: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: ShoppingBag
        };
      case ACTIVITY_TYPES.ORDER:
        return {
          label: 'Commande',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: PackageCheck
        };
      case ACTIVITY_TYPES.PAYMENT_SUCCESS:
        return {
          label: 'Paiement Réussi',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2
        };
      case ACTIVITY_TYPES.PAYMENT_FAILED:
        return {
          label: 'Paiement Échoué',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle
        };
      default:
        return {
          label: 'Activité',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Sparkles
        };
    }
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Surveillance en Direct • Campus de PK17</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Tableau de Bord &amp; Suivi des Activités
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consultez en direct qui s'est connecté, qui a créé un compte, le contenu des paniers, les commandes et les paiements reçus.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={refreshLogs}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            title="Rafraîchir"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200"
            title="Exporter l'historique"
          >
            <Download className="w-4 h-4" />
            <span>Exporter JSON</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 border border-rose-200"
            title="Vider les logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 KEY STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1 : Inscriptions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inscrits</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.registrations}</div>
            <div className="text-[11px] text-slate-400 font-medium">Nouveaux comptes</div>
          </div>
        </div>

        {/* KPI 2 : Connexions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Connexions</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.logins}</div>
            <div className="text-[11px] text-slate-400 font-medium">Sessions ouvertes</div>
          </div>
        </div>

        {/* KPI 3 : Ajouts Panier */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paniers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.cartAdds}</div>
            <div className="text-[11px] text-slate-400 font-medium">Articles ajoutés</div>
          </div>
        </div>

        {/* KPI 4 : Commandes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Commandes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.orders}</div>
            <div className="text-[11px] text-slate-400 font-medium">Commandes passées</div>
          </div>
        </div>

        {/* KPI 5 : Total Encaissé */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Encaissé MoMo/OM</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              {stats.totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-bold">FCFA</span>
            </div>
            <div className="text-[11px] text-indigo-300 font-medium">
              {stats.successfulPaymentsCount} paiement(s) validé(s)
            </div>
          </div>
        </div>

      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom d'étudiant, email, téléphone (ex: 677...), ou article..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes les activités ({logs.length})
          </button>

          <button
            onClick={() => setActiveTab('LOGIN')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'LOGIN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>🔐 Qui s'est connecté ({stats.logins})</span>
          </button>

          <button
            onClick={() => setActiveTab('REGISTER')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'REGISTER'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>👤 Qui a créé un compte ({stats.registrations})</span>
          </button>

          <button
            onClick={() => setActiveTab('CART')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'CART'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛒 Qui a mis quoi au panier ({stats.cartAdds})</span>
          </button>

          <button
            onClick={() => setActiveTab('ORDER')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'ORDER'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>📦 Qui a commandé quoi ({stats.orders})</span>
          </button>

          <button
            onClick={() => setActiveTab('PAYMENT')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'PAYMENT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>💳 Qui a payé ({stats.successfulPaymentsCount})</span>
          </button>
        </div>

      </div>

      {/* ACTIVITIES FEED TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">
            Journal d'Audit des Événements ({filteredLogs.length} entrées)
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Dernière sync : {lastRefreshed.toLocaleTimeString('fr-FR')}
          </span>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const badge = getEventBadge(log.type);
              const BadgeIcon = badge.icon;

              return (
                <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Event Type & Student Profile */}
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-2xl border ${badge.color} shrink-0 mt-0.5`}>
                      <BadgeIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <h3 className="text-sm font-black text-slate-900">
                          {log.userName}
                        </h3>
                        {log.meta?.operator && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            log.meta.operator === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {log.meta.operator === 'orange' ? 'Orange Money' : 'MTN MoMo'}
                          </span>
                        )}
                      </div>

                      {/* Action Details */}
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {log.details}
                      </p>

                      {/* Contact metadata */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        {log.userEmail && log.userEmail !== 'Non renseigné' && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {log.userEmail}
                          </span>
                        )}
                        {log.userPhone && log.userPhone !== 'Non renseigné' && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            +237 {log.userPhone}
                          </span>
                        )}
                        {log.meta?.department && (
                          <span className="text-indigo-600 font-semibold">
                            Filière: {log.meta.department}
                          </span>
                        )}
                        {log.meta?.transactionId && (
                          <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            Réf: {log.meta.transactionId}
                          </span>
                        )}
                        {log.meta?.deliveryDate && (
                          <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            <Calendar className="w-3 h-3 text-purple-600" />
                            📅 Livr: {log.meta.deliveryDate} ({log.meta?.deliveryTime?.split(' ')[0] || ''})
                          </span>
                        )}
                        {log.meta?.deliveryAddress && (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            <Truck className="w-3 h-3 text-slate-500" />
                            {log.meta.deliveryAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Timestamp */}
                  <div className="text-right shrink-0 md:self-center pl-12 md:pl-0">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center md:justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(log.timestamp)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl font-bold">
              ∅
            </div>
            <h3 className="text-sm font-bold text-slate-700">Aucune activité trouvée</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Aucun événement ne correspond à ce filtre ou à votre recherche actuelle.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
