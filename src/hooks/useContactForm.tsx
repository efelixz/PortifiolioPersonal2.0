import { useState, useCallback } from 'react';
import { sendEmail, validateFormData, checkRateLimit, sanitizeInput } from '@/utils/emailjs';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

interface FormState {
  data: FormData;
  errors: FormErrors;
  isLoading: boolean;
  isSuccess: boolean;
  successMessage: string;
}

export function useContactForm() {
  const [state, setState] = useState<FormState>({
    data: {
      name: '',
      email: '',
      message: '',
    },
    errors: {},
    isLoading: false,
    isSuccess: false,
    successMessage: '',
  });

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: sanitizeInput(value),
      },
      errors: {
        ...prev.errors,
        [field]: undefined, // Clear field error when user types
        general: undefined,
      },
      isSuccess: false, // Reset success state when user types
    }));
  }, []);

  const validateField = useCallback((field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        if (value.trim().length > 50) return 'Nome deve ter no máximo 50 caracteres';
        break;
      
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email deve ter um formato válido';
        break;
      
      case 'message':
        if (!value.trim()) return 'Mensagem é obrigatória';
        if (value.trim().length < 10) return 'Mensagem deve ter pelo menos 10 caracteres';
        if (value.trim().length > 1000) return 'Mensagem deve ter no máximo 1000 caracteres';
        break;
    }
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    Object.entries(state.data).forEach(([field, value]) => {
      const error = validateField(field as keyof FormData, value);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    setState(prev => ({
      ...prev,
      errors: newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  }, [state.data, validateField]);

  const submitForm = useCallback(async (): Promise<void> => {
    // Reset previous states
    setState(prev => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      errors: { ...prev.errors, general: undefined },
    }));

    try {
      // Validate form
      if (!validateForm()) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          errors: {
            ...prev.errors,
            general: 'Por favor, corrija os erros no formulário',
          },
        }));
        return;
      }

      // Check rate limiting
      if (!checkRateLimit(state.data.email)) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          errors: {
            ...prev.errors,
            general: 'Muitas tentativas. Tente novamente em 1 hora.',
          },
        }));
        return;
      }

      // Send email
      const result = await sendEmail(state.data);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          successMessage: result.message,
          data: {
            name: '',
            email: '',
            message: '',
          }, // Reset form on success
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          errors: {
            ...prev.errors,
            general: result.message,
          },
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        errors: {
          ...prev.errors,
          general: 'Erro inesperado. Tente novamente ou entre em contato diretamente.',
        },
      }));
    }
  }, [state.data, validateForm]);

  const resetForm = useCallback(() => {
    setState({
      data: {
        name: '',
        email: '',
        message: '',
      },
      errors: {},
      isLoading: false,
      isSuccess: false,
      successMessage: '',
    });
  }, []);

  return {
    data: state.data,
    errors: state.errors,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    successMessage: state.successMessage,
    updateField,
    validateField,
    submitForm,
    resetForm,
  };
}