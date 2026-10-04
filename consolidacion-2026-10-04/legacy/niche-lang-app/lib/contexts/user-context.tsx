import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserProfile, UserStats } from "@/shared/types";
import type { LanguageCode, NicheType } from "@/shared/types";
import { deleteSecurely, retrieveSecurely, storeSecurely } from "@/lib/services/security";
import { addToSyncQueue, toSyncPayload } from "@/lib/services/sync";

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addNiche: (niche: NicheType) => Promise<void>;
  removeNiche: (niche: NicheType) => Promise<void>;
  updateStats: (stats: Partial<UserStats>) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserAction =
  | { type: "SET_USER"; payload: UserProfile }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "UPDATE_STATS"; payload: Partial<UserStats> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGOUT" };

const initialState: UserProfile | null = null;

function userReducer(state: UserProfile | null, action: UserAction): UserProfile | null {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "UPDATE_PROFILE":
      if (!state) return null;
      return { ...state, ...action.payload };
    case "UPDATE_STATS":
      if (!state) return null;
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case "LOGOUT":
      return null;
    default:
      return state;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboarded, setIsOnboarded] = React.useState(false);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser =
          (await retrieveSecurely("user_profile")) ??
          (await AsyncStorage.getItem("user_profile"));
        const onboarded = await AsyncStorage.getItem("onboarded");

        if (storedUser) {
          dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
          // Migrate legacy AsyncStorage data to the secure platform adapter.
          await storeSecurely("user_profile", storedUser);
          await AsyncStorage.removeItem("user_profile");
        }
        setIsOnboarded(onboarded === "true");
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;

    const updated = { ...user, ...profile };
    dispatch({ type: "UPDATE_PROFILE", payload: profile });

    try {
      await storeSecurely("user_profile", JSON.stringify(updated));
      await addToSyncQueue("profile", toSyncPayload(profile));
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const addNiche = async (niche: NicheType) => {
    if (!user) return;

    const niches = [...new Set([...user.subscribedNiches, niche])];
    await updateProfile({ subscribedNiches: niches });
  };

  const removeNiche = async (niche: NicheType) => {
    if (!user) return;

    const niches = user.subscribedNiches.filter((n) => n !== niche);
    await updateProfile({ subscribedNiches: niches });
  };

  const updateStats = async (stats: Partial<UserStats>) => {
    if (!user) return;

    const updated = { ...user.stats, ...stats };
    dispatch({ type: "UPDATE_STATS", payload: stats });

    try {
      await storeSecurely("user_profile", JSON.stringify({ ...user, stats: updated }));
      await addToSyncQueue("stats", toSyncPayload(stats));
    } catch (error) {
      console.error("Failed to save stats:", error);
    }
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    try {
      await deleteSecurely("user_profile");
      await AsyncStorage.removeItem("user_profile");
      await AsyncStorage.removeItem("onboarded");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        updateProfile,
        addNiche,
        removeNiche,
        updateStats,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

