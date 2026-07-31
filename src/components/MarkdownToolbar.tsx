import React, { useState } from 'react';
import { Bold, Italic, Heading, List, Quote, Code, Link as LinkIcon, Smile } from 'lucide-react';

interface MarkdownToolbarProps {
  value: string;
  onChange: (newValue: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  value,
  onChange,
  textareaRef,
  className = ''
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const EMOJIS = ['🚨', '⚽', '🚀', '📢', '🏆', '📌', '⚠️', '🔥', '✅', '💡', '👑', '⭐', '🔴', '🟢'];

  const insertFormat = (prefix: string, suffix: string = '', defaultText: string = '') => {
    if (textareaRef?.current) {
      const el = textareaRef.current;
      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;
      const selectedText = value.substring(start, end);
      const textToInsert = selectedText || defaultText;
      const replacement = `${prefix}${textToInsert}${suffix}`;
      const newValue = value.substring(0, start) + replacement + value.substring(end);
      
      onChange(newValue);

      setTimeout(() => {
        el.focus();
        if (selectedText) {
          el.setSelectionRange(start, start + replacement.length);
        } else {
          const newCursorPos = start + prefix.length + textToInsert.length;
          el.setSelectionRange(start + prefix.length, newCursorPos);
        }
      }, 0);
    } else {
      onChange(value + (value ? '\n' : '') + prefix + defaultText + suffix);
    }
  };

  const insertEmoji = (emoji: string) => {
    insertFormat(emoji, '', '');
    setShowEmojiPicker(false);
  };

  return (
    <div className={`flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 border border-slate-300 rounded-t-lg text-slate-700 text-xs font-sans ${className}`}>
      {/* Negrita */}
      <button
        type="button"
        title="Negrita (**texto**)"
        onClick={() => insertFormat('**', '**', 'texto en negrita')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 font-bold text-slate-800"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Cursiva */}
      <button
        type="button"
        title="Cursiva (*texto*)"
        onClick={() => insertFormat('*', '*', 'texto en cursiva')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 italic text-slate-800"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

      {/* Encabezado */}
      <button
        type="button"
        title="Título (## Título)"
        onClick={() => insertFormat('\n## ', '', 'Título')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 font-extrabold text-slate-800"
      >
        <Heading className="w-3.5 h-3.5" />
      </button>

      {/* Lista */}
      <button
        type="button"
        title="Lista de viñetas (- elemento)"
        onClick={() => insertFormat('\n- ', '', 'Elemento de lista')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 text-slate-800"
      >
        <List className="w-3.5 h-3.5" />
      </button>

      {/* Cita */}
      <button
        type="button"
        title="Cita de texto (> cita)"
        onClick={() => insertFormat('\n> ', '', 'Cita importante')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 text-slate-800"
      >
        <Quote className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

      {/* Enlace */}
      <button
        type="button"
        title="Enlace ([Texto](URL))"
        onClick={() => insertFormat('[', '](https://)', 'Texto del enlace')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 text-slate-800"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </button>

      {/* Código */}
      <button
        type="button"
        title="Código en línea (`código`)"
        onClick={() => insertFormat('`', '`', 'código')}
        className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 text-slate-800"
      >
        <Code className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

      {/* Picker de Emojis */}
      <div className="relative">
        <button
          type="button"
          title="Insertar Emoji"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1.5 hover:bg-slate-200 hover:text-slate-900 rounded transition flex items-center gap-1 text-amber-600 font-bold"
        >
          <Smile className="w-3.5 h-3.5 text-amber-500" />
        </button>

        {showEmojiPicker && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-slate-300 shadow-xl rounded-lg p-2 grid grid-cols-7 gap-1 w-48 animate-scale-up">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="w-6 h-6 hover:bg-slate-100 rounded text-sm flex items-center justify-center transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="ml-auto text-[10px] text-slate-400 font-mono hidden sm:inline-block pr-1">
        Markdown soportado
      </span>
    </div>
  );
};
