import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('portfolio_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        localStorage.removeItem('portfolio_user');
      }
    }
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Verificar se já existe usuário com este email
      const existingUsers = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
      const userExists = existingUsers.find((u: User) => u.email === email);
      
      if (userExists) {
        throw new Error('Usuário já existe com este email');
      }

      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
      };

      // Salvar lista de usuários
      const updatedUsers = [...existingUsers, { ...newUser, password }];
      localStorage.setItem('portfolio_users', JSON.stringify(updatedUsers));

      // Login automático após registro
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('portfolio_user', JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      const userData: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('portfolio_user', JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('portfolio_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('portfolio_user', JSON.stringify(updatedUser));

    // Atualizar também na lista de usuários
    const users = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, ...data } : u
    );
    localStorage.setItem('portfolio_users', JSON.stringify(updatedUsers));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}