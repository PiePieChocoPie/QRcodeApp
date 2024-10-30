import { Link, Tabs, useFocusEffect, useNavigation } from 'expo-router';
import { projColors } from 'src/stores/styles';
import * as Icons from '../../assets/navbar_icons';
import Popup from 'src/components/popup';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PopupProvider, usePopupContext } from 'src/PopupContext'; // Обновите путь при необходимости
import Store from "src/stores/mobx";
import React, { useState, useEffect } from 'react';
import clientAdd from './clientAdd';

const TabsLayout = () => {
  const navigation = useNavigation();
  const isBitrixUser = Store.userData.NAME ? true : false;
  const isIt = isBitrixUser?Store.userData.UF_DEPARTMENT[0] != 11 ? false : true : false;
  return (
        <Tabs
          screenOptions={{ 
            tabBarActiveTintColor: '#DE283B', // Активный цвет иконок - красный
            tabBarInactiveTintColor: projColors.currentVerse.font,
          }}
        >
          <Tabs.Screen
            name="reader"
            options={{
              headerTitle: 'Сканер QR',
              tabBarShowLabel: false,
              headerRight: () =>(
                <Link href={'scanStory'}>
                  <Icons.list name="scan" width={32} height={32} fill={projColors.currentVerse.font}/>
                  </Link>
              ),
              // href: isRegUser?'reader':null,
              tabBarIcon: ({ color }) => (
                <Icons.qr name="qrcode" width={32} height={32} fill={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="tasks"
            options={{
              headerTitle: 'Задачи',
              tabBarShowLabel: false,
              href: isBitrixUser?'tasks':null,
              tabBarIcon: ({ color }) => (
                <Icons.tasks name="tasks" width={32} height={32} fill={color} />
              ),
            }}
          />          
          <Tabs.Screen
            name="profile"
            options={{
              headerTitle: 'Профиль',
              tabBarShowLabel: false,
              href: isBitrixUser?'profile':null,
              tabBarIcon: ({ color }) => (
                <Icons.profile name="user" width={32} height={32} fill={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              headerTitle: 'Отчеты',
              tabBarShowLabel: false,
              href: isBitrixUser?'reports':null,
              tabBarIcon: ({ color }) => (
                <Icons.list name="document-outline" width={32} height={32} fill={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="colleagues"
            options={{
              headerTitle: 'Справочник',
              tabBarShowLabel: false,
              href: isBitrixUser?'colleagues':null,
              tabBarIcon: ({ color }) => (
                <Icons.colleagues name="colleagues" width={32} height={32} fill={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="clientAdd"
            options={{
              headerTitle: 'Добавление клиента',
              tabBarShowLabel: false,
              href: isIt?'clientAdd':null,
              tabBarIcon: ({ color }) => (
                <Icons.client_Add name="clientAdd" width={32} height={32} fill={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scanStory"
            options={{
              headerTitle: 'История сканирования',
              tabBarShowLabel: false,
              href: null,
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