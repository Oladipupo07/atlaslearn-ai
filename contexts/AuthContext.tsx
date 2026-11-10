"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  guestName: string;
  isOnline: boolean;
  loading: boolean;
  continueAsGuest: (name?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: true,
  guestName: "Atlas Scholar",
  isOnline: true,
  loading: false,
  continueAsGuest: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [guestName, setGuestName] = useState("Atlas Scholar");
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const savedName = localStorage.getItem("atlaslearn_guest_name") || "Atlas Scholar";
      setGuestName(savedName);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          setIsGuest(false);
        } else {
          // Always allow local offline vault access when not signed into Firebase
          setIsGuest(true);
        }
        setLoading(false);
      },
      () => {
        setIsGuest(true);
        setLoading(false);
      }
    );

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribe();
    };
  }, []);

  const continueAsGuest = (name?: string) => {
    const finalName = name?.trim() || "Atlas Scholar";
    localStorage.setItem("atlaslearn_guest_mode", "true");
    localStorage.setItem("atlaslearn_guest_name", finalName);
    setGuestName(finalName);
    setIsGuest(true);
    setLoading(false);
  };

  const logout = async () => {
    try {
      localStorage.removeItem("atlaslearn_guest_mode");
      if (user) {
        await signOut(auth);
      }
      setUser(null);
      setIsGuest(true);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        guestName,
        isOnline,
        loading,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
