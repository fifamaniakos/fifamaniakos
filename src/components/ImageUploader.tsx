import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  presetGallery?: string[];
}

const DEFAULT_PRESETS = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format&fit=crop&q=80'
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Subir o seleccionar imagen',
  placeholder = 'Pegar enlace de imagen (https://...)',
  className = '',
  presetGallery = DEFAULT_PRESETS
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImgError(false);
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setImgError(false);
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-tech mb-1">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-900 max-h-48 flex items-center justify-center p-1">
          {imgError ? (
            <div className="py-8 text-center space-y-2 text-slate-400">
              <ImageIcon className="w-10 h-10 mx-auto opacity-50" />
              <p className="text-xs font-tech font-bold">Vista previa no disponible</p>
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              onError={() => setImgError(true)}
              className="max-h-44 w-auto object-contain rounded-lg mx-auto"
            />
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setImgError(false);
                onChange('');
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold font-tech uppercase shadow-md"
            >
              <X className="w-4 h-4" /> Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 space-y-3">
          {/* Navigation tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold font-tech">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-[#00ba68] text-[#00ba68]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Subir desde equipo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`px-3 py-1.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'preset'
                  ? 'border-[#00ba68] text-[#00ba68]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Galería EA FC
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'border-[#00ba68] text-[#00ba68]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Enlace URL
            </button>
          </div>

          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#00ba68] bg-emerald-50'
                  : 'border-slate-300 hover:border-[#00ba68] bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 mx-auto text-[#00ba68] mb-2" />
              <p className="text-xs font-medium text-slate-700">
                Arrastra tu imagen aquí o <span className="text-[#00ba68] font-bold">haz clic para examinar</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Soporta capturas de pantalla, JPG, PNG o WEBP</p>
            </div>
          )}

          {/* Tab 2: Presets */}
          {activeTab === 'preset' && (
            <div className="grid grid-cols-5 gap-2">
              {presetGallery.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset)}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 hover:border-[#00ba68] transition-all h-16 shadow-xs"
                >
                  <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Tab 3: URL input */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
              <button
                type="submit"
                className="fc-button-primary px-4 py-2 text-xs font-bold uppercase rounded-lg"
              >
                Usar
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
