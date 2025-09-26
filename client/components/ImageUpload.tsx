import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useImageUpload, formatFileSize, type UploadedImage } from '@/hooks/useImageUpload';

interface ImageUploadComponentProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUploadComponent({ 
  onImageSelect, 
  currentImage, 
  className = '' 
}: ImageUploadComponentProps) {
  const { uploadImage, removeImage, isUploading, error } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const uploadedImage = await uploadImage(file);
    if (uploadedImage) {
      setPreviewImage(uploadedImage.url);
      onImageSelect(uploadedImage.url);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    onImageSelect('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-2">
        Imagem do Projeto
      </label>
      
      {previewImage ? (
        // Preview da imagem
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative rounded-lg overflow-hidden border border-slate-600">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="bg-white/20 backdrop-blur text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                  title="Trocar imagem"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500/80 backdrop-blur text-white p-2 rounded-lg hover:bg-red-500 transition-colors"
                  title="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Upload area
        <motion.div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive 
              ? 'border-purple-400 bg-purple-400/10' 
              : 'border-slate-600 hover:border-slate-500'
          } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center">
            {isUploading ? (
              <>
                <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-white/80">Carregando imagem...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-white/80 mb-2">
                  Clique ou arraste uma imagem aqui
                </p>
                <p className="text-white/50 text-sm">
                  PNG, JPG, WebP até 5MB
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-white/50 mt-2">
        Recomendado: 1200x800px para melhor qualidade
      </p>
    </div>
  );
}