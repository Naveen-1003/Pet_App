import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the User type
export interface User {
  id: number;
  name: string;
  isSubscribed: boolean;
}

// Define the context state type
interface UserContextType {
  user: User | null;
  setIsSubscribed: (status: boolean) => void;
  login: (name: string) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize with null
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string) => {
    setUser({ id: 1, name, isSubscribed: false });
  };

  // Function to toggle subscription status
  const setIsSubscribed = (status: boolean) => {
    setUser((prevUser) => prevUser ? { ...prevUser, isSubscribed: status } : null);
  };

  return (
    <UserContext.Provider value={{ user, setIsSubscribed, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
