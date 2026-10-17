import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discountPercent, 
    discountAmount, 
    totalAmount, 
    applyPromo,
    promoCode 
  } = useCart();

  const [inputPromo, setInputPromo] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('campus'); // 'campus' (0 FCFA) or 'home' (500 FCFA)
  const navigate = useNavigate();

  const deliveryFee = deliveryMethod === 'campus' ? 0 : 500;
  const finalTotal = totalAmount + deliveryFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputPromo.trim()) {
      applyPromo(inputPromo);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/paiement', {
      state: {
        deliveryMethod,
        deliveryFee,
        finalTotal
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Votre panier est vide
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Vous n'avez pas encore ajouté d'articles. Découvrez nos calculatrices, hoodies, friandises et accessoires pour le campus !
          </p>
        </div>
        <Link
          to="/produits"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Découvrir nos produits</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Mon Panier ({cart.length} articles)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vérifiez vos articles avant de procéder au règlement Mobile Money.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vider tout le panier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:border-indigo-100 transition"
            >
              {/* Product Thumbnail */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 bg-slate-100"
              />

              {/* Product Details */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                  {item.categoryName}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {item.name}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Prix unitaire : <span className="text-slate-900 font-extrabold">{item.price.toLocaleString('fr-FR')} FCFA</span>
                </p>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-sm text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900">
                    {(item.price * item.quantity).toLocaleString('fr-FR')} <span className="text-xs text-indigo-600 font-bold">FCFA</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 mt-1 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              to="/produits"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continuer mes achats</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
            Récapitulatif de la commande
          </h2>

          {/* Promo Coupon Form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Code Promo Étudiant
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: ENSPD2026"
                value={inputPromo}
                onChange={(e) => setInputPromo(e.target.value)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Appliquer
              </button>
            </div>
            {promoCode && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Code "{promoCode}" appliqué (-{discountPercent}%)
              </p>
            )}
          </form>

          {/* Delivery Option */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Option de Livraison
            </label>
            <div className="space-y-2">
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs transition ${
                  deliveryMethod === 'campus' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'campus'}
                    onChange={() => setDeliveryMethod('campus')}
                    className="text-indigo-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Retrait Campus ENSPD</span>
                    <span className="text-[11px] text-slate-500">Au Foyer des Étudiants (PK17)</span>
                  </div>
                </div>
                <span className="font-black text-emerald-600">GRATUIT</span>
              </label>

              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs transition ${
                  deliveryMethod === 'home' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'home'}
                    onChange={() => setDeliveryMethod('home')}
                    className="text-indigo-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Livraison Résidence / Quartier</span>
                    <span className="text-[11px] text-slate-500">Zone PK17 &amp; Cité universitaire</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900">500 FCFA</span>
              </label>
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total articles :</span>
              <span className="font-bold text-slate-900">{subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Remise étudiante (-{discountPercent}%) :</span>
                <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Frais de livraison :</span>
              <span className="font-bold text-slate-900">
                {deliveryFee === 0 ? 'Gratuit (0 FCFA)' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-lg font-black text-slate-950">
              <span>Total net à payer :</span>
              <span className="text-xl sm:text-2xl text-indigo-600">
                {finalTotal.toLocaleString('fr-FR')} <span className="text-xs font-bold text-slate-600">FCFA</span>
              </span>
            </div>
          </div>

          {/* Button: Passer au paiement */}
          <button
            onClick={handleProceedToCheckout}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Passer au paiement</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Security guarantee */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline shrink-0" />
              Paiement direct sécurisé MTN MoMo (*126#) &amp; Orange Money (#150#)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
