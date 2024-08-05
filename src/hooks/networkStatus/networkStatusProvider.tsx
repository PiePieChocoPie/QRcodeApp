import React, { createContext, useContext, ReactNode } from 'react';
import useNetworkStatus from 'src/hooks/networkStatus/useNetworkStatus';

const NetworkStatusContext = createContext<boolean>(false);

export const NetworkStatusProvider = ({ children }: { children: ReactNode }) => {
  const isConnected = useNetworkStatus();

  return (
    <NetworkStatusContext.Provider value={isConnected}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatusContext = () => {
  return useContext(NetworkStatusContext);
};
