import React from 'react';
import { Club } from '../../types';
import { Landmark, MapPin, Users } from 'lucide-react';

interface StadiumTabProps {
  currentClub: Club;
}

export const StadiumTab: React.FC<StadiumTabProps> = ({ currentClub }) => {
  const hasPhoto = !!currentClub.stadiumPhotoUrl;

  return (
    <div className="fc-card rounded-2xl border-slate-200 overflow-hidden shadow-md">
      <div
        className="h-48 md:h-64 relative flex items-end p-6"
        style={
          hasPhoto
            ? { backgroundImage: `url(${currentClub.stadiumPhotoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #0f172a 100%)' }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10">
          <span className="px-2.5 py-1 bg-[#02f59b] text-black text-[10px] font-extrabold uppercase rounded font-tech tracking-wider">
            Estadio Oficial
          </span>
          <h1 className="font-display font-black text-2xl md:text-4xl text-white uppercase italic tracking-wide mt-2 flex items-center gap-2">
            <Landmark className="w-7 h-7 text-[#02f59b] shrink-0" />
            {currentClub.stadium || 'Por Asignar'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Ciudad</span>
            <span className="font-display font-bold text-sm text-slate-900">
              {currentClub.stadiumCity || 'No especificada'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Capacidad</span>
            <span className="font-display font-bold text-sm text-slate-900">
              {currentClub.stadiumCapacity ? `${currentClub.stadiumCapacity.toLocaleString('es-ES')} espectadores` : 'No especificada'}
            </span>
          </div>
        </div>
      </div>

      <p className="px-6 pb-6 text-[11px] text-slate-400 font-tech italic">
        Estos datos los carga el Administrador de la Liga desde el Panel de Administración.
      </p>
    </div>
  );
};
