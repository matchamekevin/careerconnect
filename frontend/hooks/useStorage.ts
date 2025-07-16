import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer la persistance des états dans le localStorage
 * @param key - La clé pour le localStorage
 * @param initialValue - La valeur initiale par défaut
 * @returns [value, setValue] - La valeur actuelle et la fonction pour la modifier
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Récupérer la valeur stockée ou utiliser la valeur initiale
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      
      // Gestion des différents types de données
      if (typeof initialValue === 'boolean') {
        return (item === 'true') as T;
      }
      if (typeof initialValue === 'number') {
        return Number(item) as T;
      }
      if (typeof initialValue === 'string') {
        return item as T;
      }
      
      // Pour les objets et tableaux
      return JSON.parse(item);
    } catch (error) {
      console.error(`Erreur lors de la lecture du localStorage pour la clé "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre la mise à jour via une fonction
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Mettre à jour l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans le localStorage
      if (typeof valueToStore === 'object') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        window.localStorage.setItem(key, String(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde dans le localStorage pour la clé "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook personnalisé pour gérer la persistance des états de session
 * @param key - La clé pour le sessionStorage
 * @param initialValue - La valeur initiale par défaut
 * @returns [value, setValue] - La valeur actuelle et la fonction pour la modifier
 */
function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Récupérer la valeur stockée ou utiliser la valeur initiale
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) return initialValue;
      
      // Gestion des différents types de données
      if (typeof initialValue === 'boolean') {
        return (item === 'true') as T;
      }
      if (typeof initialValue === 'number') {
        return Number(item) as T;
      }
      if (typeof initialValue === 'string') {
        return item as T;
      }
      
      // Pour les objets et tableaux
      return JSON.parse(item);
    } catch (error) {
      console.error(`Erreur lors de la lecture du sessionStorage pour la clé "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre la mise à jour via une fonction
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Mettre à jour l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans le sessionStorage
      if (typeof valueToStore === 'object') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        window.sessionStorage.setItem(key, String(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde dans le sessionStorage pour la clé "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook pour nettoyer les données de localStorage d'un composant spécifique
 * @param prefix - Le préfixe des clés à nettoyer
 */
function useClearLocalStorage(prefix: string) {
  const clearStorage = () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error(`Erreur lors du nettoyage du localStorage avec le préfixe "${prefix}":`, error);
    }
  };

  return clearStorage;
}

export { useLocalStorage, useSessionStorage, useClearLocalStorage };
