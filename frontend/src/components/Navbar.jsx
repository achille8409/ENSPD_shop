import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Sparkles, 
  Search,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Boutique officielle ENSPD • Livraison rapide sur le Campus de PK17 !</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-indigo-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Paiement Sécurisé MTN MoMo &amp; Orange Money
            </span>
            <span className="text-indigo-300">|</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              Support WhatsApp : +237 651 86 50 28
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-black text-lg tracking-wider">
                <span className="text-amber-400">E</span>N
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-950 bg-clip-text text-transparent">
                  ENSPD <span className="text-amber-500 font-black">SHOP</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Polytechnique Douala • Boutique Étudiante
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              Accueil
            </NavLink>
            <NavLink 
              to="/produits" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              Tous les Produits
            </NavLink>
            <NavLink 
              to="/produits?cat=electronique" 
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            >
              Électronique
            </NavLink>
            <NavLink 
              to="/produits?cat=friandises" 
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            >
              Friandises
            </NavLink>
            <NavLink 
              to="/produits?cat=parfums" 
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            >
              Parfums
            </NavLink>
            <NavLink 
              to="/produits?cat=accessoires" 
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            >
              Accessoires
            </NavLink>
          </nav>

          {/* Right Actions: Cart, User Profile & Admin Tracker */}
          <div className="flex items-center gap-2.5">
            {/* Admin / Activity Tracker button */}
            <Link
              to="/admin"
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Tableau de bord : voir qui s'est connecté, qui a créé un compte, les paniers et les commandes"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="hidden sm:inline">Suivi Activités</span>
              <span className="sm:hidden font-black text-[11px]">Admin 📊</span>
            </Link>

            {/* Quick search button */}
            <Link 
              to="/produits" 
              aria-label="Rechercher des articles"
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Shopping Cart Button */}
            <Link 
              to="/panier" 
              className="relative p-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-2xl transition-all duration-200 group"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-900 transition text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold max-w-[100px] truncate">
                    {user?.name || 'Mon Compte'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Connecté en tant que</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 font-bold border-b border-slate-100"
                    >
                      <span>📊 Tableau de Bord &amp; Suivi</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Accueil
          </NavLink>
          <NavLink
            to="/produits"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Tous les Produits
          </NavLink>
          <NavLink
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
          >
            📊 Suivi Activités &amp; Commandes
          </NavLink>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <Link
              to="/produits?cat=electronique"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700"
            >
              ⚡ Électronique
            </Link>
            <Link
              to="/produits?cat=friandises"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700"
            >
              🍪 Friandises
            </Link>
            <Link
              to="/produits?cat=parfums"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700"
            >
              ✨ Parfums
            </Link>
            <Link
              to="/produits?cat=accessoires"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700"
            >
              🎒 Accessoires
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="pt-4 flex flex-col gap-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
              >
                Créer un compte étudiant
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
