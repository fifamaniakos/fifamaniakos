import React, { useEffect, useRef, useState } from 'react';
import { Club } from '../types';
import { Sparkles, X, Gamepad2, User, UserPlus, Mail, Lock, Shield, ChevronDown } from 'lucide-react';
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
  const [selectedDivision, setSelectedDivision] = useState<'1ra División' | '2da División'>('1ra División');
  const [selectedCountry, setSelectedCountry] = useState('TODOS');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isClubDropdownOpen, setClubDropdownOpen] = useState(false);
  const [showNoSlotsPopup, setShowNoSlotsPopup] = useState(false);
  const clubDropdownRef = useRef<HTMLDivElement>(null);

  const isDivision1 = (club: Club) => !club.division || club.division === '1ra División' || club.division === 'Primera División';
  const isDivision2 = (club: Club) => club.division === '2da División' || club.division === 'Segunda División';

  const vacantClubs = clubs.filter(club =>
    club.manager.toLowerCase().includes('vacante') ||
    club.manager.toLowerCase().includes('por inscribir')
  );
  const division1VacantCount = vacantClubs.filter(isDivision1).length;
  const division2VacantCount = vacantClubs.filter(isDivision2).length;

  const availableClubs = vacantClubs.filter(club =>
    selectedDivision === '1ra División' ? isDivision1(club) : isDivision2(club)
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

  useEffect(() => {
    if (!isOpen) return;
    setShowNoSlotsPopup(division1VacantCount === 0 && division2VacantCount > 0);
    setSelectedDivision('1ra División');
  }, [isOpen]);

  useEffect(() => {
    if (!isClubDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (clubDropdownRef.current && !clubDropdownRef.current.contains(e.target as Node)) {
        setClubDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isClubDropdownOpen]);

  if (!isOpen) return null;

  const selectedClub = availableClubs.find(club => club.id === selectedClubId);

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

    // Se vincula el club a la cuenta ANTES de actualizar sus datos: la
    // politica RLS de update sobre "clubs" exige que el club ya este
    // vinculado al manager autenticado (current_manager_club_id()), si no
    // el paso siguiente (onRegisterClub) es rechazado por RLS.
    const { error: linkError } = await linkClub(selectedClub.id);
    if (linkError) {
      setError(`Cuenta creada, pero no se pudo vincular el club: ${linkError}`);
      setSubmitting(false);
      return;
    }

    onRegisterClub(newClub);

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
              <Shield className="w-3.5 h-3.5 text-slate-500" /> División *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedDivision('1ra División'); setSelectedCountry('TODOS'); }}
                className={`px-3 py-2.5 rounded-lg text-xs font-tech font-bold uppercase border transition-colors ${
                  selectedDivision === '1ra División'
                    ? 'bg-[#00ba68] text-white border-[#00ba68]'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-emerald-400'
                }`}
              >
                1ra División ({division1VacantCount})
              </button>
              <button
                type="button"
                onClick={() => { setSelectedDivision('2da División'); setSelectedCountry('TODOS'); }}
                className={`px-3 py-2.5 rounded-lg text-xs font-tech font-bold uppercase border transition-colors ${
                  selectedDivision === '2da División'
                    ? 'bg-[#00ba68] text-white border-[#00ba68]'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-emerald-400'
                }`}
              >
                2da División ({division2VacantCount})
              </button>
            </div>
          </div>

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

          <div ref={clubDropdownRef} className="relative">
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" /> Club disponible *
            </label>
            <button
              type="button"
              disabled={filteredAvailableClubs.length === 0}
              onClick={() => setClubDropdownOpen(open => !open)}
              className="w-full flex items-center gap-2.5 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {selectedClub ? (
                <>
                  <ClubLogo
                    src={selectedClub.logoUrl}
                    alt={selectedClub.name}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover bg-white shrink-0"
                  />
                  <span className="truncate">{selectedClub.name}</span>
                </>
              ) : (
                <span className="text-slate-400">No hay clubes disponibles</span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto shrink-0 transition-transform ${isClubDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isClubDropdownOpen && filteredAvailableClubs.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl py-1">
                {groupedCountries.map(country => (
                  <div key={country}>
                    <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 font-tech bg-slate-50 sticky top-0">
                      {country} ({clubsByCountry[country].length})
                    </div>
                    {clubsByCountry[country].map(club => (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => {
                          setSelectedClubId(club.id);
                          setClubDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left hover:bg-emerald-50 transition ${club.id === selectedClubId ? 'bg-emerald-50 text-[#00873f]' : 'text-slate-800'}`}
                      >
                        <ClubLogo
                          src={club.logoUrl}
                          alt={club.name}
                          className="w-7 h-7 rounded-full border border-slate-200 object-cover bg-white shrink-0"
                        />
                        <span className="truncate">{club.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
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

      {showNoSlotsPopup && (
        <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 max-w-sm w-full p-6 rounded-2xl shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="font-display font-black text-lg text-slate-900 uppercase italic">
              Sin cupos en 1ra División
            </h2>
            <p className="text-sm text-slate-600">
              Por ahora no hay clubes disponibles en 1ra División, pero hay{' '}
              <strong className="text-emerald-700">{division2VacantCount} cupo{division2VacantCount === 1 ? '' : 's'} disponible{division2VacantCount === 1 ? '' : 's'}</strong>{' '}
              en 2da División.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNoSlotsPopup(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setSelectedDivision('2da División');
                  setSelectedCountry('TODOS');
                  setShowNoSlotsPopup(false);
                }}
                className="flex-1 fc-button-primary px-4 py-2.5 text-xs font-extrabold uppercase shadow-md"
              >
                Ver 2da División
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

