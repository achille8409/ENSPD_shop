import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  Tag, 
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/api';

export const CATEGORIES_LIST = [
  { id: 'all', name: 'Tous les produits', slug: 'all', emoji: '✨' },
  { id: 'electronique', name: 'Appareils électroniques', slug: 'electronique', emoji: '⚡' },
  { id: 'friandises', name: 'Friandises & Snacks', slug: 'friandises', emoji: '🍪' },
  { id: 'parfums', name: 'Parfums & Soins', slug: 'parfums', emoji: '🌸' },
  { id: 'accessoires', name: 'Accessoires & Goodies', slug: 'accessoires', emoji: '🎒' }
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES_LIST);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await apiService.getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: slug });
    }
  };

  // Real-time filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
        // Search query filter (matches name, description or categoryName)
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(query));

        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // Default popularity
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalogue Officiel ENSPD 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Nos Produits Campus
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Retrouvez tout le nécessaire pour vos cours, TP, révisions et votre vie étudiante à Douala.
        </p>
      </div>

      {/* Interactive Controls: Search Bar & Sort Dropdown */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Real-time Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche en temps réel (ex: calculatrice, hoodie, chocolat, parfum...)"
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-900 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                title="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="popular">Trier par : Popularité</option>
              <option value="price-asc">Prix : Moins cher au plus cher</option>
              <option value="price-desc">Prix : Plus cher au moins cher</option>
              <option value="rating">Meilleures notes (Avis)</option>
              <option value="newest">Nouveautés en premier</option>
            </select>
          </div>

        </div>

        {/* Categories Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
        <div>
          Affichage de <span className="font-extrabold text-slate-900">{filteredProducts.length}</span> produit(s)
          {selectedCategory !== 'all' && (
            <span> dans <span className="font-semibold text-indigo-600">
              {categories.find(c => c.slug === selectedCategory)?.name}
            </span></span>
          )}
          {searchQuery && (
            <span> correspondant à « <span className="font-semibold text-slate-800">{searchQuery}</span> »</span>
          )}
        </div>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              searchParams.delete('cat');
              setSearchParams(searchParams);
            }}
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-black">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Aucun produit trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Nous n'avons trouvé aucun résultat correspondant à votre recherche. Essayez un autre mot-clé ou changez de catégorie.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              searchParams.delete('cat');
              setSearchParams(searchParams);
            }}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition"
          >
            Voir tous les produits
          </button>
        </div>
      )}

    </div>
  );
}
