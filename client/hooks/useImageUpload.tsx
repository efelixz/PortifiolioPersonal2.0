import { useState, useCallback } from 'react';

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

interface UseImageUploadReturn {
  uploadedImages: UploadedImage[];
  uploadImage: (file: File) => Promise<UploadedImage | null>;
  removeImage: (id: string) => void;
  isUploading: boolean;
  error: string | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export function useImageUpload(): UseImageUploadReturn {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<UploadedImage | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validações
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Tipo de arquivo não suportado. Use PNG, JPG, JPEG, WebP ou GIF.');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('Arquivo muito grande. O tamanho máximo é 5MB.');
      }

      // Criar URL temporária para preview
      const imageUrl = URL.createObjectURL(file);
      const imageId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);

      const uploadedImage: UploadedImage = {
        id: imageId,
        file,
        url: imageUrl,
        name: file.name,
        size: file.size,
      };

      setUploadedImages(prev => [...prev, uploadedImage]);
      
      // Simular upload (em produção, enviaria para um serviço como Cloudinary, AWS S3, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000));

      return uploadedImage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  return {
    uploadedImages,
    uploadImage,
    removeImage,
    isUploading,
    error,
  };
}

// Utilitário para converter File para base64 (para persistência local)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Utilitário para converter base64 para blob URL
export function base64ToUrl(base64: string): string {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}

// Componente de upload de imagem
export interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  currentImage?: string;
  className?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}