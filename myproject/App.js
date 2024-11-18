import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // Используйте, если хотите показать индикатор загрузки
import TabsLayout from 'app/(tabs)/_layout';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = useCallback(async () => {
      await Font.loadAsync({
          'RegularFont': require('./assets/fonts/Nunito-Regular.ttf'),
          'BoldFont': require('./assets/fonts/Nunito-Bold.ttf'),
      });
      setFontsLoaded(true);
  }, []);

  useEffect(() => {
      loadFonts();
  }, [loadFonts]);

  if (!fontsLoaded) {
    return (
       <AppLoading /> // Показывает экран загрузки, пока шрифты не будут загружены
    );
  }

  return (
    <TabsLayout/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
