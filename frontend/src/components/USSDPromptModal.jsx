import React, { useState } from 'react';
import { Smartphone, CheckCircle2, XCircle, ShieldCheck, Lock } from 'lucide-react';

export default function USSDPromptModal({ 
  isOpen, 
  operator, 
  amount, 
  phone, 
  onConfirm, 
  onCancel, 
  isProcessing 
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isMtn = operator === 'mtn';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('Veuillez saisir votre code PIN à 4 ou 5 chiffres');
      return;
    }
    setError('');
    onConfirm(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 transform transition-all animate-in zoom-in-95">
        
        {/* USSD Modal Header with Operator Color */}
        <div className={`p-4 text-center ${isMtn ? 'bg-amber-400 text-slate-950' : 'bg-orange-500 text-white'}`}>
          <div className="inline-flex p-2 rounded-2xl bg-white/20 backdrop-blur-md mb-2">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black uppercase tracking-wide">
            {isMtn ? 'MTN Mobile Money' : 'Orange Money'}
          </h3>
          <p className="text-xs font-semibold opacity-90">
            Notification Push USSD instantanée
          </p>
        </div>

        {/* Simulation Body */}
        <div className="p-6">
          {isProcessing ? (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className={`w-16 h-16 rounded-full border-4 border-t-transparent animate-spin ${isMtn ? 'border-amber-400' : 'border-orange-500'}`}></div>
                <Lock className="w-6 h-6 absolute inset-0 m-auto text-slate-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">Traitement sécurisé...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Connexion à la passerelle {isMtn ? 'MTN MoMo Cameroon' : 'Orange Money API'}.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center space-y-1">
                <p className="text-xs text-slate-500 font-medium">Demande de débit initiée par :</p>
                <p className="text-sm font-extrabold text-indigo-900">ENSPD SHOP - PK17</p>
                <div className="pt-2 text-xl font-black text-slate-900">
                  {amount.toLocaleString('fr-FR')} <span className="text-xs font-bold text-slate-500">FCFA</span>
                </div>
                <p className="text-[11px] text-slate-400">Numéro : +237 {phone}</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Code secret PIN (Simulation)</span>
                  <span className="text-[10px] text-slate-400">Ex: 1234</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={5}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  Mode Sandbox actif : entrez n'importe quel code à 4 chiffres (ex: 1234)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Refuser
                </button>
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition shadow-md active:scale-95 ${
                    isMtn
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/20'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                  }`}
                >
                  Valider PIN
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
