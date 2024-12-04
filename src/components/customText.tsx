import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { projColors } from 'src/stores/styles';
import useFonts from 'src/useFonts';

// Определяем типы текста как строковые литералы
type TextType = 'normal' | 'header' | 'description';

// Определяем пропсы для компонента
interface CustomTextProps {
  type?: TextType; // Тип текста, по умолчанию 'normal'
  color?: string;  // Кастомный цвет текста
  size?: number; //размер текста
  textAlign?: 'left' | 'center' | 'right'; // выравнивание текста
  children: React.ReactNode; // Текст внутри компонента
}

const CustomText: React.FC<CustomTextProps> = ({ type = 'normal', color, size, textAlign, children }) => {
  const fontsLoaded = useFonts(); // Проверяем, загружены ли шрифты
  const baseStyle = styles[type] || styles.normal;

  // Применяем базовый стиль и переопределяем цвет, если он передан
  const textStyle: TextStyle[] = [
    baseStyle,
    color ? { color } : {},
    size ? { fontSize: size } : {},
    textAlign ? { textAlign } : {},
  ];

  // Рендерим компонент только после загрузки шрифтов
  return fontsLoaded ? <Text style={textStyle}>{children}</Text> : null;
};

const styles = StyleSheet.create({
  normal: {
    fontSize: 16,
    fontWeight: '400',
    color: projColors.currentVerse.font, // Основной цвет по умолчанию
    fontFamily: "baseFont",
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: projColors.currentVerse.font, // Цвет для заголовка
    fontFamily: "boldFont",
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '300',
    color: projColors.currentVerse.fontAlter, // Полупрозрачный цвет для описания
    fontFamily: "baseFont",
    textAlign: 'center',
  },
});

export default CustomText;
