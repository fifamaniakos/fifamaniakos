import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, KeyRound, Check, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin key
    if (password.trim() === 'fifamaniakos' || password.trim() === 'admin' || password.trim() === '1234') {
      setError('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('Clave de administrador incorrecta. Intenta con "fifamaniakos".');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-[#02f59b]" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                Acceso Administrador
              </h2>
              <p className="text-xs text-slate-500 font-tech">Liga FIFAMANIAKOS FC 27</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Contraseña de Comisario / Admin *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Ingresa clave de admin (Ej: fifamaniakos)"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition font-mono"
            />
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-tech flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-tech space-y-1.5">
            <p className="font-bold text-[#00ba68] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#00ba68] inline" /> Clave por defecto para demo:
            </p>
            <p>Escribe <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800 font-bold">fifamaniakos</code> o <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800 font-bold">admin</code> para ingresar.</p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

