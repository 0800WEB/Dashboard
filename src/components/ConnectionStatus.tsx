'use client'
import React, { ReactNode } from 'react';
import { useServerConnection } from '@/hooks/useServerConnection';
import Loader from "@/components/ui/loader"; 

interface ConnectionStatusProps {
  children: ReactNode;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ children }) => {
  const isConnected = useServerConnection();

  if (isConnected === (null || false)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col gap-4">
        <Loader />
        <p className="ml-4 text-gray-600">Conectando con el servidor...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ConnectionStatus;
