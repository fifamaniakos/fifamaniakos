import React, { useEffect, useState } from 'react';
import { Club } from '../types';
import { Sparkles, X, Gamepad2, User, UserPlus, Mail, Lock, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { ClubLogo } from './ClubLogo';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClub: (club: Club) => string;
  clubs: Club[];
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterClub,
  clubs
}) => {
  const { signUp, linkClub } = useAuth();
  const [manager, setManager] = useState('');
  const [gamertag, setGamertag] = useState('');
  const [platform, setPlatform] = useState<'PS5' | 'Xbox Series X' | 'PC'>('PS5');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('TODOS');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableClubs = clubs.filter(club =>
    club.manager.toLowerCase().includes('vacante') ||
    club.manager.toLowerCase().includes('por inscribir')
  );
  const availableCountries = Array.from(new Set(availableClubs.map(club => club.country || 'Otros'))).sort();
  const filteredAvailableClubs = selectedCountry === 'TODOS'
    ? availableClubs
    : availableClubs.filter(club => (club.country || 'Otros') === selectedCountry);
  const clubsByCountry: Record<string, Club[]> = filteredAvailableClubs.reduce((groups: Record<string, Club[]>, club) => {
    const country = club.country || 'Otros';
    groups[country] = groups[country] ? [...groups[country], club] : [club];
    return groups;
  }, {});
  const groupedCountries = Object.keys(clubsByCountry).sort();

  useEffect(() => {
    if (!isOpen) return;
    if (selectedClubId && filteredAvailableClubs.some(club => club.id === selectedClubId)) return;
    setSelectedClubId(filteredAvailableClubs[0]?.id || '');
  }, [isOpen, selectedClubId, filteredAvailableClubs]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manager.trim()) return;
    const selectedClub = availableClubs.find(club => club.id === selectedClubId);
    if (!selectedClub) {
      setError('Selecciona un club disponible para completar la inscripcion.');
      return;
    }
    setError('');
    setSubmitting(true);

    const { error: signUpError } = await signUp({
      email,
      password,
      gamertag: gamertag.trim() || `@${manager.trim()}`,
      platform
    });
    if (signUpError) {
      setError(signUpError);
      setSubmitting(false);
      return;
    }

    const newClub: Club = {
      ...selectedClub,
      manager: manager.trim(),
      gamertag: gamertag.trim() || `@${manager.trim()}`,
      platform,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: []
    };

    const registeredId = onRegisterClub(newClub);

    const { error: linkError } = await linkClub(registeredId);
    if (linkError) {
      setError(`Cuenta creada, pero no se pudo vincular el club: ${linkError}`);
      setSubmitting(false);
      return;
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmitting(false);
    onClose();
    setManager('');
    setGamertag('');
    setEmail('');
    setPassword('');
    setSelectedCountry('TODOS');
    setSelectedClubId('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
              <UserPlus className="w-6 h-6 text-[#02f59b]" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                Inscripción managers
              </h2>
              <p className="text-xs text-slate-500 font-tech">Regístrate para participar en el Sorteo Draft de la Liga</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Box */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1.5 text-xs text-emerald-900 font-tech">
          <div className="flex items-center gap-2 font-bold text-[#00ba68]">
            <Sparkles className="w-4 h-4 text-[#00ba68]" /> Inscripcion con eleccion de club
          </div>
          <p>
            Ingresa tus datos como DT o manager y selecciona ahora el equipo oficial que queres representar. El draft queda solo para jugadores.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" /> Pais *
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
            >
              <option value="TODOS">Todos los paises ({availableClubs.length})</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>
                  {country} ({availableClubs.filter(club => (club.country || 'Otros') === country).length})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" /> Club disponible *
            </label>
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
            >
              {filteredAvailableClubs.length === 0 ? (
                <option value="">No hay clubes disponibles</option>
              ) : (
                groupedCountries.map(country => (
                  <optgroup key={country} label={`${country} (${clubsByCountry[country].length})`}>
                    {clubsByCountry[country].map(club => (
                      <option key={club.id} value={club.id}>
                        {club.name} - {club.league || club.division} - EUR {(club.budget / 1000000).toFixed(1)}M
                      </option>
                    ))}
                  </optgroup>
                ))
              )}
            </select>
            {selectedClubId && (
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                {(() => {
                  const selectedClub = availableClubs.find(club => club.id === selectedClubId);
                  if (!selectedClub) return null;
                  return (
                    <>
                      <ClubLogo
                        src={selectedClub.logoUrl || selectedClub.badgeUrl}
                        alt={selectedClub.name}
                        className="w-9 h-9 rounded-full border border-slate-200 object-cover bg-white"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-black uppercase text-slate-900 truncate">{selectedClub.name}</div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          {selectedClub.country || 'Pais sin definir'} - {selectedClub.league || selectedClub.division || 'Liga sin definir'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          {selectedClub.stadium || 'Estadio sin definir'}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" /> Nombre del DT / Manager *
            </label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="Ej: Carlos_DT_Pro"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-slate-500" /> Gamertag / EA ID Online *
            </label>
            <input
              type="text"
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              placeholder="Ej: Carlos_PSN_ES"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
              Plataforma de Juego
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
            >
              <option value="PS5">🎮 PlayStation 5</option>
              <option value="Xbox Series X">🎮 Xbox Series X|S</option>
              <option value="PC">🖥️ PC (Steam / EA App)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" /> Contraseña *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-tech font-semibold rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          {/* Actions */}
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
              disabled={submitting || availableClubs.length === 0}
              className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Registrando...' : 'Confirmar Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

