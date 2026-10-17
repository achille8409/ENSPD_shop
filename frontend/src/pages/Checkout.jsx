import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Smartphone, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  ShoppingBag,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import USSDPromptModal from '../components/USSDPromptModal';
import { activityLogger, ACTIVITY_TYPES } from '../services/activityLogger';

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If redirected with direct buy or specific state
  const directProduct = location.state?.product;
  const isDirectBuy = !!directProduct && cart.length === 0;

  const checkoutItems = isDirectBuy ? [{ ...directProduct, quantity: 1 }] : cart;
  const deliveryFee = location.state?.deliveryFee || 0;
  const calculatedTotal = isDirectBuy ? (directProduct.price + deliveryFee) : (totalAmount + deliveryFee);

  // Form State
  const [operator, setOperator] = useState('mtn'); // 'mtn' | 'orange'
  const [phone, setPhone] = useState(user?.phone || '');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [campusLocation, setCampusLocation] = useState('Foyer des Étudiants ENSPD (PK17)');
  const [notes, setNotes] = useState('');

  // UI Flow State
  const [isUSSDModalOpen, setIsUSSDModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'failed'
  const [transactionData, setTransactionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-detect operator based on Cameroon prefixes
  useEffect(() => {
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.startsWith('67') || cleaned.startsWith('68') || cleaned.startsWith('650') || cleaned.startsWith('651') || cleaned.startsWith('652') || cleaned.startsWith('653') || cleaned.startsWith('654')) {
      setOperator('mtn');
    } else if (cleaned.startsWith('69') || cleaned.startsWith('655') || cleaned.startsWith('656') || cleaned.startsWith('657') || cleaned.startsWith('658') || cleaned.startsWith('659')) {
      setOperator('orange');
    }
  }, [phone]);

  // If no items in checkout and not direct buy, redirect to cart
  if (checkoutItems.length === 0 && paymentStatus !== 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Aucune commande en attente</h2>
        <p className="text-sm text-slate-500">Votre panier est actuellement vide.</p>
        <Link
          to="/produits"
          className="inline-block px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  const handleStartPayment = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      alert('Veuillez entrer un numéro de téléphone valide à 9 chiffres (ex: 677123456).');
      return;
    }
    // Open USSD prompt simulation
    setIsUSSDModalOpen(true);
  };

  const handleConfirmUSSD = async (pin) => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await apiService.processPayment({
        operator,
        phone: phone.replace(/\s+/g, ''),
        amount: calculatedTotal,
        pin,
        fullName,
        email,
        deliveryAddress: campusLocation,
        items: checkoutItems
      });

      if (response && response.success) {
        setTransactionData(response);
        setPaymentStatus('success');
        setIsUSSDModalOpen(false);
        clearCart();

        // Enregistrer l'activité de Commande
        activityLogger.logEvent(
          ACTIVITY_TYPES.ORDER,
          fullName || user?.name || 'Étudiant ENSPD',
          email || user?.email || 'Non renseigné',
          phone,
          `Nouvelle commande #${response.orderId} pour ${calculatedTotal.toLocaleString('fr-FR')} FCFA (${campusLocation})`,
          {
            orderId: response.orderId,
            total: calculatedTotal,
            items: checkoutItems.map(i => `${i.name} (x${i.quantity})`),
            deliveryAddress: campusLocation
          }
        );

        // Enregistrer l'activité de Paiement réussi
        activityLogger.logEvent(
          ACTIVITY_TYPES.PAYMENT_SUCCESS,
          fullName || user?.name || 'Étudiant ENSPD',
          email || user?.email || 'Non renseigné',
          phone,
          `Paiement de ${calculatedTotal.toLocaleString('fr-FR')} FCFA validé via ${operator === 'orange' ? 'Orange Money' : 'MTN Mobile Money'} (Réf: ${response.transactionId})`,
          {
            transactionId: response.transactionId,
            orderId: response.orderId,
            amount: calculatedTotal,
            operator,
            phone
          }
        );

        // Launch celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setPaymentStatus('failed');
        const failMsg = response?.message || "Le paiement a échoué. Veuillez vérifier votre solde ou votre code PIN.";
        setErrorMessage(failMsg);
        setIsUSSDModalOpen(false);

        // Enregistrer l'échec de paiement
        activityLogger.logEvent(
          ACTIVITY_TYPES.PAYMENT_FAILED,
          fullName || user?.name || 'Étudiant ENSPD',
          email || user?.email || 'Non renseigné',
          phone,
          `Échec du paiement Mobile Money de ${calculatedTotal.toLocaleString('fr-FR')} FCFA via ${operator === 'orange' ? 'Orange Money' : 'MTN MoMo'} (${failMsg})`,
          {
            amount: calculatedTotal,
            operator,
            phone,
            reason: failMsg
          }
        );
      }
    } catch (err) {
      setPaymentStatus('failed');
      const failMsg = err.message || "Erreur de communication avec la passerelle Mobile Money.";
      setErrorMessage(failMsg);
      setIsUSSDModalOpen(false);

      activityLogger.logEvent(
        ACTIVITY_TYPES.PAYMENT_FAILED,
        fullName || user?.name || 'Étudiant ENSPD',
        email || user?.email || 'Non renseigné',
        phone,
        `Erreur réseau passerelle de paiement (${failMsg})`,
        { amount: calculatedTotal, operator, phone }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/panier" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Panier
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Paiement en ligne Sécurisé</span>
      </div>

      {/* SUCCESS SCREEN */}
      {paymentStatus === 'success' && transactionData && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs uppercase tracking-wider border border-emerald-200">
              Transaction Réussie • 200 OK
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Paiement Confirmé avec Succès !
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Félicitations, votre commande a été validée. Votre paiement via <strong>{transactionData.operator === 'orange' ? 'Orange Money' : 'MTN Mobile Money'}</strong> a été débité instantanément.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-3 font-mono text-xs text-slate-700">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-sans">Référence Transaction :</span>
              <span className="font-bold text-indigo-700">{transactionData.transactionId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-sans">Numéro de Commande :</span>
              <span className="font-bold">{transactionData.orderId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-sans">Montant Débité :</span>
              <span className="font-extrabold text-slate-950 font-sans text-sm">
                {transactionData.amount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-sans">Opérateur Mobile :</span>
              <span className="font-bold uppercase text-amber-600">
                {transactionData.operator === 'orange' ? 'Orange Money Cameroun' : 'MTN MoMo Cameroon'}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-sans">Numéro de téléphone :</span>
              <span className="font-bold">+237 {transactionData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Lieu de Retrait :</span>
              <span className="font-bold font-sans text-slate-900">{campusLocation}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Imprimer le reçu</span>
            </button>
            <Link
              to="/produits"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>Continuer mes achats</span>
            </Link>
          </div>
        </div>
      )}

      {/* FAILED SCREEN */}
      {paymentStatus === 'failed' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <XCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 font-extrabold text-xs uppercase tracking-wider border border-rose-200">
              Transaction Échouée
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Le paiement n'a pas pu aboutir
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {errorMessage || "Le paiement a été interrompu. Cela peut arriver si vous avez annulé la notification sur votre téléphone ou en cas de solde insuffisant."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réessayer le paiement</span>
            </button>
            <Link
              to="/panier"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Modifier le panier
            </Link>
          </div>
        </div>
      )}

      {/* IDLE / NORMAL CHECKOUT FORM */}
      {paymentStatus === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Mobile Money Options */}
          <div className="lg:col-span-7 space-y-6">
            
            <form onSubmit={handleStartPayment} className="space-y-6">
              
              {/* Step 1: Choix de l'opérateur (MTN MoMo ou Orange Money) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-extrabold text-slate-900 text-base">
                    Choisissez votre opérateur Mobile Money
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* MTN Mobile Money Option */}
                  <label
                    onClick={() => setOperator('mtn')}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      operator === 'mtn'
                        ? 'border-amber-400 bg-amber-50/50 shadow-md shadow-amber-400/20'
                        : 'border-slate-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                          MTN
                        </div>
                        <div>
                          <div className="font-black text-sm text-slate-900">MTN MoMo</div>
                          <div className="text-[10px] text-slate-500">Mobile Money Cameroun</div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="operator"
                        checked={operator === 'mtn'}
                        onChange={() => setOperator('mtn')}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div className="font-bold text-amber-700">Code USSD : *126#</div>
                      <div className="text-[10px] text-slate-400">Préfixes : 67, 68, 650-654</div>
                    </div>
                  </label>

                  {/* Orange Money Option */}
                  <label
                    onClick={() => setOperator('orange')}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      operator === 'orange'
                        ? 'border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/20'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                          OM
                        </div>
                        <div>
                          <div className="font-black text-sm text-slate-900">Orange Money</div>
                          <div className="text-[10px] text-slate-500">Cameroun &amp; CEMAC</div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="operator"
                        checked={operator === 'orange'}
                        onChange={() => setOperator('orange')}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div className="font-bold text-orange-700">Code USSD : #150#</div>
                      <div className="text-[10px] text-slate-400">Préfixes : 69, 655-659</div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Step 2: Numéro de téléphone & coordonnées */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-extrabold text-slate-900 text-base">
                    Coordonnées de l'étudiant &amp; Paiement
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Phone input with Cameroon prefix */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Numéro de compte {operator === 'orange' ? 'Orange Money' : 'MTN MoMo'} *
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 bg-slate-50 overflow-hidden">
                      <span className="px-3.5 py-3 text-xs font-black text-slate-700 bg-slate-200/70 border-r border-slate-200 flex items-center gap-1">
                        🇨🇲 +237
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 677 12 34 56 ou 690 98 76 54"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full py-3 px-3 text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Vous recevrez un message de confirmation USSD sur ce numéro pour valider le débit.
                    </p>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nom complet de l'étudiant *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Junior Kamdem"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email pour le reçu
                      </label>
                      <input
                        type="email"
                        placeholder="etudiant@enspd.cm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Campus Pickup point */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Lieu de livraison / Retrait campus *
                    </label>
                    <select
                      value={campusLocation}
                      onChange={(e) => setCampusLocation(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 cursor-pointer"
                    >
                      <option value="Foyer des Étudiants ENSPD (PK17)">Foyer des Étudiants ENSPD (PK17) - Gratuit</option>
                      <option value="Bloc Pédagogique - Hall Principal (PK17)">Bloc Pédagogique - Hall Principal (PK17)</option>
                      <option value="Amphithéâtre 200 / Salle de cours (PK17)">Amphithéâtre 200 / Salle de cours (PK17)</option>
                      <option value="Bibliothèque Universitaire (PK17)">Bibliothèque Universitaire (PK17)</option>
                      <option value="Résidence / Cité Universitaire PK17">Résidence / Cité Universitaire PK17 (+500 FCFA)</option>
                    </select>
                  </div>

                  {/* Special instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Précision pour la livraison (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Appelez-moi à la fin du cours de Résistance des Matériaux"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    />
                  </div>

                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 ${
                  operator === 'mtn'
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/30'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                }`}
              >
                <Smartphone className="w-5 h-5 shrink-0" />
                <span>Payer {calculatedTotal.toLocaleString('fr-FR')} FCFA via {operator === 'mtn' ? 'MTN MoMo' : 'Orange Money'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Paiement crypté SSL et certifié conforme CEMAC / BEAC</span>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary Recap */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Récapitulatif de Commande</span>
              <span className="text-xs font-bold text-indigo-600">{checkoutItems.length} article(s)</span>
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} x {item.price.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className="text-xs font-black text-slate-900">
                    {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total :</span>
                <span className="font-bold text-slate-900">
                  {checkoutItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison :</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? 'Gratuit (Campus)' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-base font-black text-slate-950">
                <span>Total à débiter :</span>
                <span className="text-xl text-indigo-600">
                  {calculatedTotal.toLocaleString('fr-FR')} <span className="text-xs font-bold text-slate-500">FCFA</span>
                </span>
              </div>
            </div>

            {/* Sandbox notification pill */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Mode Simulation Actif
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Le système simule l'envoi de la requête USSD vers MTN / Orange. Saisissez n'importe quel code PIN (ex: 1234) pour confirmer le succès du test !
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Realistic Phone USSD Prompt Simulation Dialog */}
      <USSDPromptModal
        isOpen={isUSSDModalOpen}
        operator={operator}
        amount={calculatedTotal}
        phone={phone}
        isProcessing={isProcessing}
        onConfirm={handleConfirmUSSD}
        onCancel={() => setIsUSSDModalOpen(false)}
      />

    </div>
  );
}
