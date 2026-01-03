import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserLocation } from "@/lib/distance";
import { translateLocationToJapanese } from "@/lib/translate-location";

interface LocationContextType {
  userLocation: { lat: number; lng: number } | null;
  locationError: string | null;
  isLoading: boolean;
  requestLocation: () => void;
  hasAskedPermission: boolean;
  permissionStatus: "granted" | "denied" | "prompt" | "unknown";
  locationName: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LOCATION = {
  lat: 21.028511, // Hanoi center
  lng: 105.804817,
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const [locationName, setLocationName] = useState<string | null>(null);

  const getLocationName = async (lat: number, lng: number) => {
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await response.json();
      
      if (data.address) {
        // Format: More detailed address
        const parts = [];
        
        // Add road/street if available
        if (data.address.road) {
          parts.push(data.address.road);
        }
        
        // Add district/suburb
        if (data.address.suburb || data.address.neighbourhood || data.address.quarter) {
          parts.push(data.address.suburb || data.address.neighbourhood || data.address.quarter);
        }
        
        // Add city
        if (data.address.city) {
          parts.push(data.address.city);
        } else if (data.address.town || data.address.village) {
          parts.push(data.address.town || data.address.village);
        } else if (data.address.state) {
          parts.push(data.address.state);
        }
        
        // Allow up to 3 parts for more detail
        const locationStr = parts.slice(0, 3).join(", ");
        
        // Translate to Japanese
        const japaneseLocation = translateLocationToJapanese(locationStr);
        setLocationName(japaneseLocation || "現在地");
      } else {
        setLocationName("現在地");
      }
    } catch (error) {
      console.error("Error getting location name:", error);
      setLocationName("現在地");
    }
  };

  const requestLocation = () => {
    setIsLoading(true);
    setHasAskedPermission(true);
    
    getUserLocation()
      .then((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setLocationError(null);
        setPermissionStatus("granted");
        setIsLoading(false);
        
        // Get location name from coordinates
        getLocationName(location.lat, location.lng);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
        
        // Provide more specific error messages
        let errorMessage = "位置情報を取得できませんでした";
        if (error.code === 1) {
          errorMessage = "位置情報へのアクセスが拒否されました。ブラウザの設定で位置情報を許可してください。";
          setPermissionStatus("denied");
        } else if (error.code === 2) {
          errorMessage = "位置情報が利用できません。デバイスの位置情報サービスをオンにしてください。";
        } else if (error.code === 3) {
          errorMessage = "位置情報の取得がタイムアウトしました。もう一度お試しください。";
        }
        
        setLocationError(errorMessage);
        // Use default location as fallback
        setUserLocation(DEFAULT_LOCATION);
        setLocationName("ハノイ (デフォルト)");
        setIsLoading(false);
        
        // Return error to caller
        throw new Error(errorMessage);
      });
  };

  // Check permission status and auto-load location if granted
  useEffect(() => {
    const checkPermissionAndLoad = async () => {
      if ("permissions" in navigator) {
        try {
          const result = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          setPermissionStatus(result.state as "granted" | "denied" | "prompt");
          
          // If already granted, automatically get location
          if (result.state === "granted") {
            requestLocation();
          } else {
            // Use default location
            setUserLocation(DEFAULT_LOCATION);
            setLocationName("ハノイ (デフォルト)");
          }
          
          // Listen for permission changes
          result.onchange = () => {
            setPermissionStatus(result.state as "granted" | "denied" | "prompt");
            if (result.state === "granted") {
              requestLocation();
            }
          };
        } catch (error) {
          console.error("Error checking permission:", error);
          setUserLocation(DEFAULT_LOCATION);
          setLocationName("ハノイ (デフォルト)");
        }
      } else {
        // Fallback for browsers that don't support Permissions API
        setUserLocation(DEFAULT_LOCATION);
        setLocationName("ハノイ (デフォルト)");
      }
    };
    
    checkPermissionAndLoad();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationError,
        isLoading,
        requestLocation,
        hasAskedPermission,
        permissionStatus,
        locationName,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
