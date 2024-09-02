'use client'
// src/hooks/useServerConnection.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URI } from '@/lib/utils';

export const useServerConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = async () => {
    try {
      const response = await axios.get(`${SERVER_URI}/connect`);
      if (response.data.success) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Verifica la conexión cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  return isConnected;
};
