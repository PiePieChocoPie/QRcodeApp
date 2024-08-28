import React, { createContext, useContext, ReactNode } from 'react';
import { Text, View } from 'react-native';
import useNetworkStatus from 'src/hooks/networkStatus/useNetworkStatus';
import { styles } from 'src/stores/styles';

const NetworkStatusContext = createContext<boolean>(false);

export const NetworkStatusProvider = ({ children }: { children: ReactNode }) => {
  const isConnected = useNetworkStatus();

  return (
    <NetworkStatusContext.Provider value={isConnected}>
      {!isConnected&&
      <View style={{backgroundColor:"#db6464", height:'10%'}}>
        <Text style={styles.Text}>Нет подключения к интернету</Text>
      </View>
      }
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatusContext = () => {
  return useContext(NetworkStatusContext);
};
