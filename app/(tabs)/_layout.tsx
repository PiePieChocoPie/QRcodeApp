import { Tabs } from "expo-router";
import { projColors } from "src/stores/styles";
import React, { useEffect, useRef, useState } from "react";
import * as Icons from '../../assets/navbar_icons';
import Popup from "src/components/popup";

const TabsLayout = () => {
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     statusDay(Store.userData.ID);
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);
  const [visible, setVisible] = useState(true);
  const [popupVisible, setPopupVisible] = React.useState(false);

  const activePOP = () => {
    setPopupVisible(!popupVisible);
};
  return (
    <>
    <Popup
      type={'success'}
      message={'Бабаба'}
      PopVisible={true}
    />

      
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
      {/* <Tabs.Screen
        name="calendar"
        options={{
          headerTitle: 'Календарь',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Icons.calendar name="calendar" width={32} height={32} fill={color} />
          ),
        }}
      /> */}
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
    </>
  );
};

export default TabsLayout;
