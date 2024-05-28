import React, { useState, useEffect } from 'react';
import { Stack } from "expo-router";
import { RootSiblingParent } from 'react-native-root-siblings';
import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    'Montserrat': require('../assets/fonts/Montserrat-Regular.ttf'), // путь к файлу шрифта
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'), // путь к файлу шрифта
  });
};

const RootLayout = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);


  return (
    <RootSiblingParent>
      <Stack>
        <Stack.Screen
          name={'index'}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'(tabs)'}
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </RootSiblingParent>
  );
};

export default RootLayout;
