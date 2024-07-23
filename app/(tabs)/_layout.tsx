import React from 'react';
import { Tabs } from 'expo-router';
import { projColors } from 'src/stores/styles';
import * as Icons from '../../assets/navbar_icons';
import Popup from 'src/components/popup';
import { PopupProvider, usePopupContext } from 'src/PopupContext'; // Обновите путь при необходимости

const TabsLayout = () => {
  return (
    <PopupProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#DE283B', // Активный цвет иконок - красный
          tabBarInactiveTintColor: projColors.currentVerse.font,
        }}
      >
        <Tabs.Screen
          name="tasks"
          options={{
            headerTitle: 'Задачи',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <Icons.tasks name="tasks" width={32} height={32} fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reader"
          options={{
            headerTitle: 'Сканер QR',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <Icons.qr name="qrcode" width={32} height={32} fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Профиль',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <Icons.profile name="user" width={32} height={32} fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            headerTitle: 'Отчеты',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <Icons.list name="document-outline" width={32} height={32} fill={color} />
            ),
          }}
        />
      </Tabs>
      <PopupComponent />
    </PopupProvider>
  );
};

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

export default TabsLayout;
