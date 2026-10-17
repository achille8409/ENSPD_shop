import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart, showToast } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Redirection si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
      showToast("Veuillez vous connecter pour ajouter cet article à votre panier !", "info");
      navigate('/login', {
        state: {
          fromProduct: product,
          redirectMessage: "Veuillez vous connecter à votre compte étudiant (ou créer un compte) pour ajouter des articles au panier."
        }
      });
      return;
    }

    addToCart(product, 1);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    // Redirection si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
      showToast("Veuillez vous connecter pour procéder au paiement !", "info");
      navigate('/login', {
        state: {
          fromProduct: product,
          isDirectBuy: true,
          redirectMessage: "Veuillez vous connecter à votre compte étudiant pour passer commande et payer."
        }
      });
      return;
    }

    // Add product to cart and immediately proceed to checkout
    addToCart(product, 1);
    navigate('/paiement', { state: { directBuy: true, product } });
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge tag */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-extrabold text-white px-2.5 py-1 rounded-full shadow-md ${product.badgeColor || 'bg-indigo-600'}`}>
            {product.badge}
          </span>
        )}

        {/* Rating chip */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            {product.categoryName}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {product.price.toLocaleString('fr-FR')} <span className="text-xs font-bold text-indigo-600">FCFA</span>
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {product.originalPrice.toLocaleString('fr-FR')} FCFA
              </span>
            )}
          </div>

          {/* Under each product: TWO BUTTONS "Panier" and "Payer" */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition duration-150 active:scale-95"
              title="Ajouter au panier (Connexion requise)"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Panier</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition duration-150 active:scale-95"
              title="Payer directement (Connexion requise)"
            >
              <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
              <span>Payer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
