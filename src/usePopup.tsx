import React, { useState } from 'react';

type PopupType = 'error' | 'warning' | 'success' | 'info';

// Интерфейс состояния попапа
interface IPopupState {
  type: PopupType;
  message: string;
  popVisible: boolean;
}

// Главный интерфейс
interface IUsePopup {
  popup: IPopupState;
  showPopup: (message: string, type: PopupType) => void;
}

// Реализация кастомного хука
const usePopup = (): IUsePopup => {
  // Определение состояния для подсказки
  const [popup, setPopup] = useState<IPopupState>({
    type: 'info',
    message: '',
    popVisible: false,
  });

  // Функция для показа подсказки
  const showPopup = (message: string, type: PopupType) => {
    setPopup({ type, message, popVisible: true });

    setTimeout(() => {
      setPopup((prevPopup) => ({ ...prevPopup, popVisible: false }));
    }, 3000);
  };

  return { popup, showPopup };
};

export default usePopup;
export type { PopupType, IPopupState, IUsePopup };
