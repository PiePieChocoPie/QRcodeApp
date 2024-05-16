import React, { useEffect } from 'react';
import Toast from 'react-native-root-toast';

const ToastNotification = ({ message, duration = Toast.durations.LONG, position, onHide }) => {
  useEffect(() => {
    const toast = Toast.show(message, {
      duration: duration,
      position: position, // Добавляем свойство position
      onHidden: onHide
    });
    return () => {
      Toast.hide(toast);
    };
  }, [message, duration, position, onHide]);

  return null;
};

export default ToastNotification;
