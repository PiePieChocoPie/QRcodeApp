import {statusDay } from "src/http";
import {Tabs} from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";
import {json_styles} from "src/stores/styles";
import LottieView from 'lottie-react-native';
import anim from 'src/job_anim.json';
import React, { useEffect, useRef } from "react";
import { useFocusEffect} from '@react-navigation/native';

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
    <Tabs>
        <Tabs.Screen name ="tasks" options={{
            headerTitle: 'Задачи',
            title:"Задачи",

            tabBarIcon:({})=>(
                <Icon name="tasks" size={25} color={projColors.currentVerse.font}/>
            ),
        }}
        
        />
        <Tabs.Screen name ="reader" options={{
            headerTitle: 'Сканер QR',
            title:"Сканер",

            tabBarIcon:({})=>(
                <Icon name="qrcode" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="profile"  options={{
            headerTitle: 'Профиль',
            title:"Профиль",
            headerRight: ({})=>(
                <LottieView
                ref={animationRef}
                source={anim}
                style={json_styles.header_right_activity} 
                loop
                />
            ),
            tabBarIcon:({})=>(
                <Icon name="user" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="calendar"  options={{
            headerTitle: 'календарь',
            title:"календарь",
            // headerRight: ({})=>(
            //      <Text>{Store.statusWorkDay}</Text>
            // ),
            tabBarIcon:({})=>(
                <Icon name="calendar" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="excelTable"  options={{
            headerTitle: 'табличка',
            title:"табличка",
            // headerRight: ({})=>(
            //      <Text>{Store.statusWorkDay}</Text>
            // ),
            tabBarIcon:({})=>(
                <Icon name="table" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
    </Tabs>
    );
};


export default TabsLayout;