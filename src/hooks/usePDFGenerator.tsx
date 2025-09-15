import { useState, useCallback } from 'react';
import { exportElementToPDF, generateHiringPack, generateCV } from '@/utils/pdfGenerator';

interface PDFData {
  name: string;
  role: string;
  skills: string[];
  experience: string;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    image?: string;
    caseUrl?: string;
    codeUrl?: string;
    demoUrl?: string;
  }>;
  contact?: {
    email: string;
    linkedin?: string;
    github?: string;
  };
}

interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
  margin?: number;
}

export function usePDFGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateFromElement = useCallback(async (
    element: HTMLElement,
    options: PDFOptions = {}
  ): Promise<void> => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await exportElementToPDF(element, options);

      clearInterval(progressInterval);
      setProgress(100);

      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar PDF');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateHiringPackPDF = useCallback(async (data: PDFData): Promise<void> => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      await generateHiringPack(data);

      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar Hiring Pack');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateCVPDF = useCallback(async (data: PDFData): Promise<void> => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 250);

      await generateCV(data);

      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar CV');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateFromSection = useCallback(async (
    sectionId: string,
    options: PDFOptions = {}
  ): Promise<void> => {
    const element = document.getElementById(sectionId);
    if (!element) {
      throw new Error(`Seção com ID "${sectionId}" não encontrada`);
    }

    await generateFromElement(element, options);
  }, [generateFromElement]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    error,
    progress,
    generateFromElement,
    generateFromSection,
    generateHiringPackPDF,
    generateCVPDF,
    clearError,
  };
}