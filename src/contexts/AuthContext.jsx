import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

/**
 * Hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Provider component that wraps app and makes auth object available
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRegistering = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Try fetching from 'siswa' collection
          let docRef = doc(db, 'siswa', user.uid);
          let docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile({ id: docSnap.id, ...docSnap.data() });
            setRole('siswa');
          } else {
            // Try fetching from 'sensei' collection
            docRef = doc(db, 'sensei', user.uid);
            docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUserProfile({ id: docSnap.id, ...docSnap.data() });
              setRole('sensei');
            } else {
              // Skip orphan check if we're in the middle of registering
              if (!isRegistering.current) {
                await signOut(auth);
                setCurrentUser(null);
                setUserProfile(null);
                setRole(null);
              }
            }
          }
          setCurrentUser(user);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(null);
          setUserProfile(null);
          setRole(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Log in user
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {'siswa' | 'sensei'} expectedRole - Expected role
   */
  const login = async (username, password, expectedRole) => {
    const email = `${username}@${expectedRole}.lpkhumaira.id`;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, expectedRole, user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await signOut(auth);
        throw new Error(`Akun ini bukan akun ${expectedRole}`);
      }
      
      return docSnap.data();
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error('Username atau password salah');
      }
      throw error;
    }
  };

  /**
   * Register a new siswa
   * @param {Object} data - Registration data
   */
  const register = async (data) => {
    const { nama, kelas, telepon, username, password } = data;
    const email = `${username}@siswa.lpkhumaira.id`;
    
    isRegistering.current = true;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        nama,
        kelas,
        no_telp: telepon || '',
        username,
        role: 'siswa',
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'siswa', user.uid), userData);
      
      // Now that profile is saved, set the state manually
      setCurrentUser(user);
      setUserProfile({ id: user.uid, ...userData });
      setRole('siswa');
      
      return userData;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Username sudah digunakan');
      }
      throw error;
    } finally {
      isRegistering.current = false;
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    role,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
