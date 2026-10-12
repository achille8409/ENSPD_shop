import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Zap, 
  Star,
  Quote,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/api';
import { TESTIMONIALS } from '../data/mockData';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadData() {
      const prodData = await apiService.getProducts();
      setProducts(prodData);
      const catData = await apiService.getCategories();
      setCategories(catData.filter(c => c.id !== 'all'));
    }
    loadData();
  }, []);

  const copyPromo = () => {
    navigator.clipboard.writeText('ENSPD2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-12 right-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Boutique Officielle • ENSPD Douala</span>
                <span className="text-slate-400">|</span>
                <span className="text-indigo-600 font-extrabold">Session 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Le shopping campus des futurs <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-500 bg-clip-text text-transparent">ingénieurs.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Électronique, matériel de TP, friandises énergisantes, parfums frais et hoodies officiels. Payez instantanément par <strong>MTN MoMo</strong> ou <strong>Orange Money</strong> et retirez votre commande sur le campus !
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/produits"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Explorer le Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/produits?cat=accessoires"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm sm:text-base shadow-sm hover:shadow transition flex items-center justify-center gap-2"
                >
                  <span>Hoodies Officiels</span>
                </Link>
              </div>

              {/* Student Trust Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">+1 500</div>
                  <div className="text-xs text-slate-500 font-medium">Étudiants livrés</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Campus Ndogbong</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600">0 FCFA</div>
                  <div className="text-xs text-slate-500 font-medium">Retrait Foyer ENSPD</div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Visual Card Highlight */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Floating promo badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-amber-400 text-slate-950 px-4 py-2 rounded-2xl shadow-xl font-black text-xs rotate-6 flex items-center gap-1.5 animate-bounce">
                  <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
                  Promo Étudiant -10%
                </div>

                {/* Main Hero Card */}
                <div className="bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 relative overflow-hidden">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group">
                    <img
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
                      alt="Hoodie ENSPD"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                        Édition Limitée Campus
                      </span>
                      <h3 className="text-lg font-black">
                        Hoodie Officiel Polytech Douala 2026
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-black text-white">
                          14 000 <span className="text-xs font-semibold text-amber-300">FCFA</span>
                        </span>
                        <Link
                          to="/produits"
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-extrabold text-xs transition"
                        >
                          Commander
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Micro mini features under hero card */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                        MTN
                      </div>
                      <div className="text-left">
                        <div className="text-[11px] font-bold text-slate-800">MoMo Direct</div>
                        <div className="text-[10px] text-slate-400">0 frais de retrait</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                        OM
                      </div>
                      <div className="text-left">
                        <div className="text-[11px] font-bold text-slate-800">Orange Money</div>
                        <div className="text-[10px] text-slate-400">Validation USSD</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-current" />
              Rayons Étudiants
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Explorez par Catégorie
            </h2>
          </div>
          <Link
            to="/produits"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            Voir tout le catalogue <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/produits?cat=${cat.slug}`}
              className="group p-5 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center font-black text-lg transition-colors">
                  {cat.slug === 'electronique' && '⚡'}
                  {cat.slug === 'friandises' && '🍪'}
                  {cat.slug === 'parfums' && '✨'}
                  {cat.slug === 'accessoires' && '🎒'}
                </span>
                <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition">
                  {cat.count} articles
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cat.slug === 'electronique' && 'Calculatrices, écouteurs, câbles & TP'}
                  {cat.slug === 'friandises' && 'Chocolats Mambo, biscuits & chips'}
                  {cat.slug === 'parfums' && 'Brumes fraîches & eaux de parfum'}
                  {cat.slug === 'accessoires' && 'Hoodies, sacs à dos & gourdes'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOUVEAUTÉS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-current" />
              Arrivages Récents
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Les Nouveautés Campus
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Découvrez les derniers produits ajoutés pour ce semestre.
            </p>
          </div>
          <Link
            to="/produits"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            Tous les articles <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* STUDENT PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider inline-block">
              Code Promo Exclusif Étudiants
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Profite de 10% de réduction immédiate sur ton panier !
            </h3>
            <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
              Utilise le code promo lors de ta commande et bénéficie d'une remise directe sur tous les articles de la boutique.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                <span className="font-mono font-extrabold text-amber-300 tracking-wider text-base">
                  ENSPD2026
                </span>
                <button
                  onClick={copyPromo}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition text-white"
                  title="Copier le code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-xs text-indigo-300">
                {copiedCode ? 'Copié dans le presse-papier !' : 'Clique pour copier'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MEILLEURES VENTES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-500 font-extrabold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-current" />
              Les Incontournables
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Meilleures Ventes de l'ENSPD
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Les articles les plus plébiscités par les étudiants de Polytechnique Douala.
            </p>
          </div>
          <Link
            to="/produits"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            Explorer tout <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* AVIS CLIENTS / TÉMOIGNAGES DES ÉTUDIANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wider">
            <Star className="w-4 h-4 fill-current" />
            La voix des étudiants
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Ce que disent les polytechniciens
          </h2>
          <p className="text-sm text-slate-500">
            Découvrez les retours d'expérience de vos camarades de promo sur l'ENSPD SHOP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((test) => (
            <div 
              key={test.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{test.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{test.name}</h4>
                  <p className="text-xs text-indigo-600 font-medium">{test.department}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US / CAMPUS PROMISES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 rounded-3xl p-8 sm:p-10 border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Livraison Rapide Campus</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Retrait gratuit au Foyer des Étudiants ou livraison en amphi à l'ENSPD Ndogbong.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Paiement Mobile Sécurisé</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Validation instantanée par USSD sur MTN MoMo (*126#) et Orange Money (#150#).
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Support Étudiant 7j/7</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Une équipe d'étudiants dédiée pour répondre à vos questions sur WhatsApp en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
