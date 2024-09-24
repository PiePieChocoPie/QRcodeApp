import { Tabs } from 'expo-router';
import { projColors } from 'src/stores/styles';
import * as Icons from '../../assets/navbar_icons';
import Icon from 'react-native-vector-icons/FontAwesome6'; // Импортируем иконки
import Popup from 'src/components/popup';
import { View, Text, StyleSheet } from 'react-native';
import { PopupProvider, usePopupContext } from 'src/PopupContext'; // Обновите путь при необходимости
import { openDay, statusDay, closeDay } from "src/requests/timeManagement";
import LottieView from 'lottie-react-native';
import work from 'src/work.json';
import Store from "src/stores/mobx";
import React, { useState, useEffect, createContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const Header = () => {
  const [workStatusLocal, setWorkStatusLocal] = React.useState(null);
  const [idUser] = React.useState(Store.userData.ID);
  const checkWorkStatus = async () => {
    const response = await statusDay(idUser);
    setWorkStatusLocal(Store.statusWorkDay);
  }
  useFocusEffect(() => {
      checkWorkStatus();
    });

  console.log(workStatusLocal)
  return (
    <View style={styles.headerContainer}>
            {
              workStatusLocal === 'OPENED' && (
                  <LottieView
                  source={work}
                  autoPlay
                  loop
                  style={styles.active}
              />
              )
            }
    </View>
  );
  
}

const TabsLayout = () => {
  return (
    <PopupProvider>
      <Header />
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


const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: '#DE283B', // Red color
    height: '5%', // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: 40
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
},
  active: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    right: 0,
    top: -10,
  },
});
export default TabsLayout;