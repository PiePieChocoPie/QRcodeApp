import React, { useState, useEffect } from 'react';
import { Stack } from "expo-router";
import { RootSiblingParent } from 'react-native-root-siblings';
import { PopupProvider, usePopupContext } from 'src/PopupContext';
import Popup from 'src/components/popup';



const RootLayout = () => {

  const PopupComponent = () => {
    const { popup } = usePopupContext();
  
    return (
      <Popup
        type={popup.type}
        message={popup.message}
        PopVisible={popup.popVisible}
      />
    );
  };

  return (
    <PopupProvider>
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
    <PopupComponent />
    </PopupProvider>
  );
};

export default RootLayout;
