import React from 'react';
import { Stack } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NetworkStatusProvider } from 'src/hooks/networkStatus/networkStatusProvider';

const RootLayout = () => {
  return (
    <NetworkStatusProvider>
      <RootSiblingParent>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </RootSiblingParent>
    </NetworkStatusProvider>
  );
};

export default RootLayout;
