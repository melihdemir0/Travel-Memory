import { useEffect, useState } from "react";
import { searchAddressSuggestions } from "../utils/geocoding";

export function useAddressSuggestions(query, enabled = true) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!enabled) {
      setSuggestions([]);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    async function loadSuggestions() {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const nextSuggestions = await searchAddressSuggestions(query);
        if (isActive) {
          setSuggestions(nextSuggestions);
        }
      } catch {
        if (isActive) {
          setSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(loadSuggestions, 300);
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [enabled, query]);

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    isLoading,
    clearSuggestions,
  };
}
