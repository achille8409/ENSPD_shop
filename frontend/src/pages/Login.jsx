import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  GraduationCap,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.redirectMessage;
  const fromProduct = location.state?.fromProduct;
  const isDirectBuy = location.state?.isDirectBuy;
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);

      // Si l'utilisateur voulait ajouter un produit avant d'être redirigé
      if (fromProduct) {
        addToCart(fromProduct, 1);
        if (isDirectBuy) {
          navigate('/paiement', { state: { directBuy: true, product: fromProduct }, replace: true });
          return;
        } else {
          navigate('/panier', { replace: true });
          return;
        }
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('etudiant@enspd.cm');
    setPassword('Polytech2026!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Header Card */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-0.5 mx-auto shadow-lg shadow-indigo-600/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Espace Étudiant ENSPD
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Connectez-vous pour suivre vos commandes et acheter en un clic.
          </p>
        </div>

        {/* Redirect notice if redirected from Cart button */}
        {redirectMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5 shadow-sm animate-in fade-in">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{redirectMessage}</p>
              <p className="text-[11px] text-amber-700 font-normal">
                Si vous n'avez pas encore de compte,{' '}
                <Link to="/register" state={location.state} className="font-extrabold underline hover:text-amber-900">
                  créez votre compte ici
                </Link>.
              </p>
            </div>
          </div>
        )}

        {/* Login Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Adresse Email Universitaire ou Personnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="etudiant@enspd.cm ou gmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Mot de passe
                </label>
                <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                  Mot de passe oublié ?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick fill demo button */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tester avec le compte démo étudiant</span>
            </button>
          </div>

          {/* Redirect to Register */}
          <div className="text-center pt-2 text-xs text-slate-500">
            Vous n'avez pas encore de compte ?{' '}
            <Link to="/register" state={location.state} className="font-extrabold text-indigo-600 hover:underline">
              Inscrivez-vous ici
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
