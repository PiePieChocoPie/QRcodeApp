import React from 'react';
import { View, Text } from 'react-native';

type PopupProps = {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
};

const Popup: React.FC<PopupProps> = ({ type, message }) => {
  let backgroundColor = '';
  let color = '';

  switch (type) {
    case 'error':
      backgroundColor = '#ffe6e6'; // Красный
      color = '#b30000'; // Тёмно-красный
      break;
    case 'warning':
      backgroundColor = '#fff2cc'; // Жёлтый
      color = '#7f6000'; // Тёмно-жёлтый
      break;
    case 'success':
      backgroundColor = '#e6ffe6'; // Зелёный
      color = '#006600'; // Тёмно-зелёный
      break;
    case 'info':
      backgroundColor = '#e6f7ff'; // Голубой
      color = '#004d99'; // Тёмно-голубой
      break;
    default:
      break;
  }

  const containerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: backgroundColor,
  };

  // Style for the text component
  const textStyle = {
    color: color,
    marginLeft: 12,
    flex: 1, 
  };

  return (
    <View style={containerStyle}>
      <Text style={{ marginRight: 12 }}>{getIcon(type)}</Text>
      <Text style={textStyle}>{message}</Text>
    </View>
  );
};

// Функция для получения иконки в зависимости от типа уведомления
const getIcon = (type: string): string => {
  switch (type) {
    case 'error':
      return '⚠️'; // Иконка ошибки
    case 'warning':
      return '⚠️'; // Иконка внимания
    case 'success':
      return '✅'; // Иконка успешного выполнения
    case 'info':
      return 'ℹ️'; // Иконка информации
    default:
      return '';
  }
};

export default Popup;
