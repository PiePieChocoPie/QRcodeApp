import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'baseFont': require('../assets/fonts/Nunito-Regular.ttf'),
          'boldFont': require('../assets/fonts/Nunito-Bold.ttf'),
          // Добавьте другие шрифты по мере необходимости
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки шрифтов:', error);
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;