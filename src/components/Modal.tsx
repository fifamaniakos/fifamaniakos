import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badgeText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeText = 'FIFAMANIAKOS FC 27',
  icon,
  children,
  maxWidth = 'lg'
}) => {
  if (!isOpen) return null;

  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`bg-white border border-slate-200 w-full ${maxWidthMap[maxWidth]} rounded-2xl shadow-2xl space-y-0 text-slate-800 animate-scale-up my-auto max-h-[92vh] flex flex-col overflow-hidden`}>
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between gap-3 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-[#02f59b] flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              {badgeText && (
                <span className="px-2 py-0.5 bg-[#02f59b] text-black text-[9px] font-extrabold font-tech uppercase rounded tracking-wider inline-block">
                  {badgeText}
                </span>
              )}
              <h3 className="font-display font-black text-lg md:text-xl text-white uppercase italic tracking-wide leading-tight mt-0.5">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-slate-300 font-tech">{subtitle}</p>}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center font-bold shrink-0"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Container */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans text-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
};
