import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  GraduationCap,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Génie Informatique & Télécoms',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast, addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.redirectMessage;
  const fromProduct = location.state?.fromProduct;
  const isDirectBuy = location.state?.isDirectBuy;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'Le nom complet doit comporter au moins 3 caractères.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errs.email = 'Veuillez saisir une adresse email valide.';
    }

    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = 'Le numéro doit comporter au moins 9 chiffres (ex: 677123456).';
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Le mot de passe doit comporter au moins 6 caractères.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        password: formData.password
      });

      showToast('Votre compte étudiant a été créé avec succès !');

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

      navigate('/');
    } catch (err) {
      setErrors({ server: err.message || "Erreur lors de l'inscription." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-500 p-0.5 mx-auto shadow-lg shadow-indigo-600/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Créer un Compte Étudiant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Rejoignez la boutique ENSPD et bénéficiez de réductions exclusives.
          </p>
        </div>

        {/* Notice banner if redirected from cart/buy button */}
        {redirectMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5 shadow-sm animate-in fade-in">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{redirectMessage}</p>
              <p className="text-[11px] text-amber-700 font-normal">
                Remplissez le formulaire ci-dessous pour créer votre profil en 1 minute.
              </p>
            </div>
          </div>
        )}

        {/* Register Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5">
          
          {errors.server && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nom complet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nom complet de l'étudiant *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Christian Tchinda"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition ${
                    errors.name ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Adresse Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Ex: tchinda@enspd.cm ou gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition ${
                    errors.email ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>}
            </div>

            {/* Téléphone (MTN/Orange) & Filière */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Téléphone (MoMo / OM) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="677123456"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition ${
                      errors.phone ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-500 font-medium mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Filière / Département
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 cursor-pointer"
                >
                  <option value="Génie Informatique & Télécoms">Génie Informatique &amp; Télécoms</option>
                  <option value="Génie Électrique & Systèmes">Génie Électrique &amp; Systèmes</option>
                  <option value="Génie Mécanique">Génie Mécanique</option>
                  <option value="Génie Énergétique & Environnement">Génie Énergétique</option>
                  <option value="Génie Civil">Génie Civil</option>
                  <option value="Classes Préparatoires (MSP/PC)">Classes Préparatoires</option>
                  <option value="Personnel / Enseignant ENSPD">Personnel / Enseignant</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Min. 6 carac."
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-8 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition ${
                      errors.password ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 font-medium mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Répéter"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition ${
                      errors.confirmPassword ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Création de votre compte...</span>
              ) : (
                <>
                  <span>Créer mon compte étudiant</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Redirect to Login */}
          <div className="text-center pt-2 text-xs text-slate-500">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" state={location.state} className="font-extrabold text-indigo-600 hover:underline">
              Connectez-vous
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
