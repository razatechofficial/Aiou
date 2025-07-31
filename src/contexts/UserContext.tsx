import type React from 'react';
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from 'react';

// Update the User interface to reflect that 'user' will now be an object.
interface UserData {
  userId: number;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: {user: UserData | null}; // Wrap the 'user' object with another 'user' object
  setUser: React.Dispatch<React.SetStateAction<{user: UserData | null}>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<{user: UserData | null}>({user: null});

  useEffect(() => {
    if (user.user) {
      console.log('User from context:', user.user); // Log the user object
    }
  }, [user]);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
