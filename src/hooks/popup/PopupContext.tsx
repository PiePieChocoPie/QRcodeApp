import React, { createContext, useContext, ReactNode } from 'react';
import usePopup, { IPopupState, PopupType, IUsePopup } from './usePopup'; // Обновите путь при необходимости

interface IPopupContext {
  popup: IPopupState;
  showPopup: (message: string, type: PopupType) => void;
}

const PopupContext = createContext<IPopupContext | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const { popup, showPopup } = usePopup();

  return (
    <PopupContext.Provider value={{ popup, showPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = (): IPopupContext => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopupContext должен использоваться внутри PopupProvider');
  }
  return context;
};
