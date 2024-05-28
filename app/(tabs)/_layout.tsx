import { statusDay } from "src/http";
import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Ionicons";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";
import { json_styles } from "src/stores/styles";
import LottieView from 'lottie-react-native';
import anim from 'src/job_anim.json';
import React, { useEffect, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';

const TabsLayout = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      statusDay(Store.userData.ID);
      // console.log('Метод исполняется каждые 1000 миллисекунд = ' + Store.statusWorkDay);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: projColors.currentVerse.extrasecond,
        },
        headerTitleStyle: {
          color: projColors.currentVerse.fontAccent,
          fontFamily: 'Montserrat-Bold', 
          fontSize: 18,
        },
        tabBarActiveTintColor: projColors.currentVerse.fontAccent,
        tabBarInactiveTintColor: projColors.currentVerse.font,
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          headerTitle: 'Задачи',
          headerShown:false,
          tabBarShowLabel:false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reader"
        options={{
          headerTitle: 'Сканер QR',
          headerShown:false,
          tabBarShowLabel:false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="qrcode" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: 'Профиль',
          headerShown:false,
          tabBarShowLabel:false,
          headerRight: () => (
            <LottieView
              ref={animationRef}
              source={anim}
              style={json_styles.header_right_activity}
              loop
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerTitle: 'Календарь',
          headerShown:false,
          tabBarShowLabel:false,
          headerRight: () => (
            <LottieView
              source={anim}
              style={{ width: "100%", height: "100%" }}
              autoPlay
              loop
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          headerTitle: 'Отчеты',
          headerShown:false,
          tabBarShowLabel:false,
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="document-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
