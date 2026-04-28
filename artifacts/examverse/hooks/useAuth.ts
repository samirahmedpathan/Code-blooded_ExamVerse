import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const value = await AsyncStorage.getItem('isAuthenticated');
      setIsAuthenticated(value === 'true');
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}