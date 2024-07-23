import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

type PopupProps = {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  PopVisible: boolean;  // Убедитесь, что имя пропса соответствует
  onClose?: () => void;  // Опциональный пропс для обработки закрытия
};

const Popup: React.FC<PopupProps> = ({ type, message, PopVisible, onClose }) => {
  const [visible, setVisible] = useState(PopVisible);
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (PopVisible) {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 50,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hidePopup();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      hidePopup();
    }
  }, [PopVisible]);

  const hidePopup = () => {
    Animated.timing(translateY, {
      toValue: -150,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (onClose) onClose(); // Вызываем функцию закрытия, если она передана
    });
  };

  if (!visible) {
    return null;
  }

  let backgroundColor = '';
  let color = '';

  switch (type) {
    case 'error':
      backgroundColor = '#ffe6e6';
      color = '#b30000';
      break;
    case 'warning':
      backgroundColor = '#fff2cc';
      color = '#7f6000';
      break;
    case 'success':
      backgroundColor = '#e6ffe6';
      color = '#006600';
      break;
    case 'info':
      backgroundColor = '#e6f7ff';
      color = '#004d99';
      break;
    default:
      break;
  }

  return (
    <TouchableWithoutFeedback onPress={hidePopup}>
      <Animated.View
        style={[styles.container, { backgroundColor, transform: [{ translateY }] }]}
      >
        <Text style={styles.icon}>{getIcon(type)}</Text>
        <Text style={[styles.text, { color }]}>{message}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const getIcon = (type: 'error' | 'warning' | 'success' | 'info'): string => {
  switch (type) {
    case 'error':
    case 'warning':
      return '⚠️';
    case 'success':
      return '✅';
    case 'info':
      return 'ℹ️';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    margin: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Popup;
