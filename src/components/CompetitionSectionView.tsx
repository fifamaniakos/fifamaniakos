import React, { useState } from 'react';
import { CompetitionSection, ForumSectionTag } from '../types';
import { ArrowLeft, Edit3, X, FileText } from 'lucide-react';

interface CompetitionSectionViewProps {
  section: CompetitionSection;
  isAdmin: boolean;
  onBack: () => void;
  onSave: (title: string, content: string) => void;
}

interface SectionMeta {
  badge: string;
  tagline: string;
  image: string;
  badgeColor: string;
  glowColor: string;
  gradient: string;
  border: string;
}

const SECTION_META: Record<ForumSectionTag, SectionMeta> = {
  normas: {
    badge: 'REGLAMENTO OFICIAL',
    tagline: 'Las reglas que rigen todas las competiciones de la liga.',
    image: '/badges/normas.png',
    badgeColor: 'bg-blue-500',
    glowColor: 'bg-blue-500/10',
    gradient: 'from-slate-950 via-blue-950 to-indigo-950',
    border: 'border-blue-500/40'
  },
  ganancias: {
    badge: 'ECONOMÍA DE LIGA',
    tagline: 'Premios, bonos y ganancias por rendimiento en cada competición.',
    image: '/badges/ganancias.png',
    badgeColor: 'bg-amber-500',
    glowColor: 'bg-amber-500/10',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    border: 'border-amber-500/40'
  },
  sanciones: {
    badge: 'DISCIPLINA DEPORTIVA',
    tagline: 'Sanciones y penalizaciones aplicadas por infracciones al reglamento.',
    image: '/badges/sanciones.png',
    badgeColor: 'bg-rose-600',
    glowColor: 'bg-rose-500/10',
    gradient: 'from-slate-950 via-rose-950 to-slate-900',
    border: 'border-rose-500/40'
  },
  apuestas: {
    badge: 'CASA DE APUESTAS',
    tagline: 'Cuotas y modalidades de apuestas deportivas entre managers.',
    image: '/badges/apuestas.png',
    badgeColor: 'bg-purple-600',
    glowColor: 'bg-purple-500/10',
    gradient: 'from-slate-950 via-purple-950 to-slate-900',
    border: 'border-purple-500/40'
  },
  mercado: {
    badge: 'MERCADO OFICIAL',
    tagline: 'Normas y límites para fichajes, ventas y préstamos entre clubes.',
    image: '/badges/mercado.png',
    badgeColor: 'bg-emerald-600',
    glowColor: 'bg-emerald-500/10',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    border: 'border-emerald-500/40'
  }
};

export const CompetitionSectionView: React.FC<CompetitionSectionViewProps> = ({
  section,
  isAdmin,
  onBack,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);

  const meta = SECTION_META[section.tag];

  const startEditing = () => {
    setTitle(section.title);
    setContent(section.content);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-tech font-bold text-sm uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      {/* Section Banner Header */}
      <div className={`fc-card p-6 md:p-8 rounded-2xl ${meta.border} bg-gradient-to-r ${meta.gradient} text-white shadow-2xl relative overflow-hidden`}>
        <div className={`absolute -right-10 -bottom-10 w-64 h-64 ${meta.glowColor} rounded-full blur-3xl pointer-events-none`} />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shrink-0 shadow-inner">
              <img src={meta.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 ${meta.badgeColor} text-white text-[10px] font-tech font-extrabold uppercase rounded tracking-wider`}>
                  {meta.badge}
                </span>
              </div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                {section.title}
              </h1>
              <p className="text-xs text-slate-300 font-tech">
                {meta.tagline}
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={startEditing}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-tech font-bold uppercase flex items-center gap-1.5 border border-white/20 transition-colors shrink-0"
            >
              <Edit3 className="w-4 h-4" /> Editar Sección
            </button>
          )}
        </div>
      </div>

      <div className="fc-card p-6 md:p-8 rounded-2xl border-slate-200 shadow-md space-y-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="font-display font-black text-xl text-slate-900 uppercase italic tracking-wide">
                Editar Sección
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                TÍTULO *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                CONTENIDO
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Escribí el contenido de esta sección..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        ) : (
          section.content.trim() ? (
            <div className="space-y-6">
              {section.content.split('---').map((block, bIdx) => {
                const lines = block.trim().split('\n').filter(Boolean);
                if (lines.length === 0) return null;

                const headerLine = lines.find(l => l.startsWith('###'));
                const bodyLines = lines.filter(l => !l.startsWith('###'));

                return (
                  <div key={bIdx} className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    {headerLine && (
                      <h3 className="font-display font-black text-base md:text-lg text-slate-900 uppercase italic tracking-wide flex items-center gap-2 border-b border-slate-200 pb-2.5">
                        {headerLine.replace('###', '').trim()}
                      </h3>
                    )}

                    <div className="space-y-2.5 text-xs md:text-sm font-tech text-slate-700">
                      {bodyLines.map((line, lIdx) => {
                        const cleanLine = line.replace(/^\*\s*/, '').trim();
                        if (!cleanLine) return null;

                        // Resaltar negritas **texto**
                        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

                        return (
                          <div key={lIdx} className="flex items-start gap-2.5 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <p className="flex-1 text-slate-800 font-semibold">
                              {parts.map((part, pIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={pIdx} className="text-emerald-800 font-black px-1 py-0.5 bg-emerald-50 rounded border border-emerald-200/60">
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-tech">
                {isAdmin
                  ? 'Todavía no cargaste contenido para esta sección. Tocá "Editar Sección" para escribirlo.'
                  : 'Todavía no hay contenido publicado para esta sección.'}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
