import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';

const FamilyContext = createContext(null);

const defaultAvatar = ['🧑‍🚀', '👩‍🔬', '🧒', '👧', '🦸', '🧙'];

export const FamilyProvider = ({ children }) => {
  const { user } = useAuth();
  const [familyId, setFamilyId] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const boot = async () => {
      if (!user) {
        setProfile(null);
        setFamilyId(null);
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const generatedFamilyId = crypto.randomUUID();
        const newProfile = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'Family Member',
          avatar: defaultAvatar[Math.floor(Math.random() * defaultAvatar.length)],
          role: 'parent',
          familyId: generatedFamilyId,
        };
        await setDoc(userRef, { ...newProfile, createdAt: new Date().toISOString() });
        await setDoc(doc(db, 'families', generatedFamilyId), {
          name: `${newProfile.name}'s Family`,
          createdBy: user.uid,
        });
        setProfile(newProfile);
        setFamilyId(generatedFamilyId);
        return;
      }

      const userData = userSnap.data();
      setProfile(userData);
      setFamilyId(userData.familyId);
    };

    boot();
  }, [user]);

  const value = useMemo(() => ({ familyId, profile, setProfile }), [familyId, profile]);

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};

export const useFamily = () => useContext(FamilyContext);
