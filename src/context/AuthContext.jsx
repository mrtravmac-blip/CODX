import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, provider } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (activeUser) => {
      setUser(activeUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
      registerEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
      loginGoogle: () => signInWithPopup(auth, provider),
      logout: () => signOut(auth),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
