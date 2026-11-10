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
  isGuest: false,
  guestName: "Atlas Learner",
  isOnline: true,
  loading: true,
  continueAsGuest: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState("Atlas Learner");
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const savedGuest = localStorage.getItem("atlaslearn_guest_mode") === "true";
      const savedName = localStorage.getItem("atlaslearn_guest_name") || "Atlas Learner";
      if (savedGuest) {
        setIsGuest(true);
        setGuestName(savedName);
      }
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
        }
        setLoading(false);
      },
      () => {
        // If Firebase auth observer errors while offline, fall back cleanly
        setLoading(false);
      }
    );

    // Ensure loading resolves quickly even if Firebase Auth hangs when offline
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const continueAsGuest = (name?: string) => {
    const finalName = name?.trim() || "Atlas Learner";
    localStorage.setItem("atlaslearn_guest_mode", "true");
    localStorage.setItem("atlaslearn_guest_name", finalName);
    setGuestName(finalName);
    setIsGuest(true);
    setLoading(false);
  };

  const logout = async () => {
    try {
      localStorage.removeItem("atlaslearn_guest_mode");
      setIsGuest(false);
      if (user) {
        await signOut(auth);
      }
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
