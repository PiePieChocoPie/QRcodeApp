import { Tabs, useFocusEffect } from 'expo-router';
import { projColors } from 'src/stores/styles';
import * as Icons from '../../assets/navbar_icons';
import Popup from 'src/components/popup';
import { View, StyleSheet } from 'react-native';
import { PopupProvider, usePopupContext } from 'src/PopupContext'; // Обновите путь при необходимости
import Store from "src/stores/mobx";
import React, { useState, useEffect } from 'react';

const TabsLayout = () => {
  const isIt = Store.userData.UF_DEPARTMENT[0] != 11 ? null : 'clientAdd'
  return (
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
          <Tabs.Screen
            name="colleagues"
            options={{
              headerTitle: 'Справочник',
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ color }) => (
                <Icons.colleagues name="colleagues" width={32} height={32} fill={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="clientAdd"
            options={{
              headerTitle: 'Добавление клиента',
              headerShown: false,
              tabBarShowLabel: false,
              href: isIt,
              tabBarIcon: ({ color }) => (
                <Icons.client_Add name="clientAdd" width={32} height={32} fill={color} />
              ),
            }}
          />

        </Tabs>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: '6%', // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    width: 40,
    height: 40,
  },
});

export default TabsLayout;