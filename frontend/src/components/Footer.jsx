import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-black text-base">
                  <span className="text-amber-400">E</span>N
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                ENSPD <span className="text-amber-400">SHOP</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              La plateforme e-commerce officielle créée pour la communauté universitaire de l'École Nationale Supérieure Polytechnique de Douala (ENSPD). High-tech, friandises, parfums et goodies au meilleur tarif étudiant.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                100% Étudiant &amp; Campus
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                Paiement Instantané
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Boutique
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/produits" className="hover:text-amber-400 transition flex items-center gap-1">
                  Tous les articles <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=electronique" className="hover:text-amber-400 transition">
                  Appareils Électroniques
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=friandises" className="hover:text-amber-400 transition">
                  Friandises &amp; Snacks
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=parfums" className="hover:text-amber-400 transition">
                  Parfums &amp; Brumes
                </Link>
              </li>
              <li>
                <Link to="/produits?cat=accessoires" className="hover:text-amber-400 transition">
                  Hoodies &amp; Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links & Campus */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Campus ENSPD
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-white transition cursor-pointer">Point relais : Foyer des étudiants (PK17)</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Livraison express en Amphi</span></li>
              <li><Link to="/admin" className="text-amber-400 font-bold hover:underline transition">📊 Suivi Activités &amp; Commandes</Link></li>
              <li><span className="hover:text-white transition cursor-pointer">Programme Ambassadeur Campus</span></li>
              <li><span className="hover:text-white transition cursor-pointer">BDE Polytechnique Douala</span></li>
            </ul>
          </div>

          {/* Contact & Payments */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Moyens de Paiement
            </h4>
            
            {/* MoMo & OM Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                MTN Mobile Money (MoMo)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                Orange Money Cameroun
              </div>
            </div>

            <div className="pt-2 text-xs space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                Campus de PK17, Douala, Cameroun
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                WhatsApp : +237 651 86 50 28
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                contact@enspd-shop.cm
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ENSPD SHOP - École Nationale Supérieure Polytechnique de Douala. Tous droits réservés.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Fait avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> pour les ingénieurs du futur
          </div>
        </div>
      </div>
    </footer>
  );
}
