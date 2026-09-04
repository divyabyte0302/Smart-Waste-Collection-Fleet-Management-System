import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '../common/Button';

interface ImageUploadPreviewProps {
  value: string | null;
  onChange: (image: string | null) => void;
  maxSizeBytes?: number; // default 5MB
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  value,
  onChange,
  maxSizeBytes = 5 * 1024 * 1024
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image. Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`Image size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInputValue.trim()) return;
    onChange(urlInputValue.trim());
    setUrlInputValue('');
    setUseUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Complaint Evidence Photo (Optional)
        </label>
        <button
          type="button"
          onClick={() => setUseUrlInput(!useUrlInput)}
          className="text-xs text-eco-400 hover:text-eco-300 flex items-center gap-1 transition-colors"
        >
          {useUrlInput ? (
            <>
              <UploadCloud className="w-3.5 h-3.5" /> Switch to File Upload
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5" /> Paste Image URL
            </>
          )}
        </button>
      </div>

      {value ? (
        /* Image Preview State */
        <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group max-w-md">
          <img
            src={value}
            alt="Evidence Preview"
            className="w-full h-56 object-cover transition-transform group-hover:scale-105 duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-md border border-white/10">
              <ImageIcon className="w-3.5 h-3.5 text-eco-400" />
              Evidence photo attached
            </span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onChange(null)}
              className="px-2.5 py-1 text-xs"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : useUrlInput ? (
        /* URL Input State */
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20"
          />
          <Button type="button" size="sm" onClick={handleApplyUrl}>
            Attach
          </Button>
        </div>
      ) : (
        /* Drag & Drop Upload State */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? 'border-eco-500 bg-eco-500/10'
              : 'border-slate-700/80 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <UploadCloud className="w-6 h-6 text-eco-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              <span className="text-eco-400 underline decoration-eco-400/50">Click to browse</span> or drag and drop photo
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Supports PNG, JPG, WebP up to 5MB</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
