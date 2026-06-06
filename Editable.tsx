import { useEffect, useRef, useState } from "react";
import { cn } from "./utils/cn";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  editMode: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function EditableText({
  value,
  onChange,
  editMode,
  className,
  multiline = false,
  placeholder = "Click to edit...",
  as: Tag = "span",
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select?.();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  if (!editMode) {
    const Comp = Tag as React.ElementType;
    return <Comp className={className}>{value}</Comp>;
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          rows={Math.max(2, Math.ceil(draft.length / 60))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) commit();
          }}
          placeholder={placeholder}
          className={cn(
            "w-full bg-amber-400/10 border border-amber-400 text-white rounded-lg px-2 py-1 outline-none",
            className,
          )}
        />
      );
    }
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
          if (e.key === "Enter") commit();
        }}
        placeholder={placeholder}
        className={cn(
          "bg-amber-400/10 border border-amber-400 text-white rounded-lg px-2 py-0.5 outline-none w-full",
          className,
        )}
      />
    );
  }

  const Comp = Tag as React.ElementType;
  return (
    <Comp
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
      }}
      className={cn(
        className,
        "outline-1 outline-dashed outline-amber-400/60 outline-offset-2 rounded-sm cursor-text hover:bg-amber-400/10 transition-colors",
      )}
      title="Click to edit"
    >
      {value || <span className="text-amber-300/60 italic">{placeholder}</span>}
    </Comp>
  );
}

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (val: string) => void;
  editMode: boolean;
  className?: string;
}

export function EditableImage({
  src,
  alt,
  onChange,
  editMode,
  className,
}: EditableImageProps) {
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState(src);

  useEffect(() => {
    setDraft(src);
  }, [src]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Image too large. Please choose a file under 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onChange(dataUrl);
      setShowInput(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("relative group", editMode && "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-zinc-900 rounded-2xl")}>
      <img src={src} alt={alt} className={className} />

      {editMode && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInput((s) => !s);
            }}
            className="absolute top-2 left-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-lg z-20"
          >
            ✏️ EDIT IMAGE
          </button>

          {showInput && (
            <div
              className="absolute top-12 left-2 right-2 z-30 bg-zinc-950 border border-amber-400 rounded-2xl p-3 space-y-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs text-amber-300">Paste image URL:</div>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="https://..."
                className="w-full bg-zinc-900 text-white text-xs px-2 py-1.5 rounded-lg border border-white/20 outline-none focus:border-amber-400"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onChange(draft);
                    setShowInput(false);
                  }}
                  className="flex-1 bg-amber-400 text-zinc-950 text-xs font-bold py-1.5 rounded-lg"
                >
                  Save URL
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-zinc-800 text-white text-xs font-bold py-1.5 rounded-lg border border-white/10"
                >
                  📁 Upload File
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => setShowInput(false)}
                className="w-full text-center text-xs text-zinc-400 hover:text-white pt-1"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
