import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Кастомный хук для проверки подключения к интернету
const useNetworkStatus = (): boolean => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useNetworkStatus;
