import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MaintenanceModeProps {
  message: string;
}

export function MaintenanceMode({ message }: MaintenanceModeProps) {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-neon-400 mb-4">Under Maintenance</h1>
        <p className="text-dark-200 mb-8">{message}</p>
        <div className="animate-pulse text-dark-400 text-sm">
          Please check back later
        </div>
      </div>
    </div>
  );
}