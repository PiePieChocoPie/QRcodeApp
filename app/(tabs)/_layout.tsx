import {statusDay } from "src/http";
import {Tabs} from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";

import LottieView from 'lottie-react-native';
import anim from 'src/job_anim.json';

import {Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, Alert} from "react-native";
const TabsLayout = () => {
    statusDay(Store.userData.ID);
    console.log(Store.statusWorkDay)
    return (
    <Tabs>
        <Tabs.Screen name ="tasks" options={{
            headerTitle: 'Задачи',
            title:"Задачи",
            headerRight: ({})=>(
                <LottieView 
                source={anim} 
                style={{width: "100%", height: "100%"}} 
                autoPlay 
                loop
                />
            ),
            tabBarIcon:({})=>(
                <Icon name="tasks" size={25} color={projColors.currentVerse.font}/>
            ),
        }}
        
        />
        <Tabs.Screen name ="reader" options={{
            headerTitle: 'Сканер QR',
            title:"Сканер",
            headerRight: ({})=>(
                <LottieView 
                source={anim} 
                style={{width: "100%", height: "100%"}} 
                autoPlay 
                loop
                />
            ),
            tabBarIcon:({})=>(
                <Icon name="qrcode" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="profile"  options={{
            headerTitle: 'Профиль',
            title:"Профиль",
            headerRight: ({})=>(
                <LottieView 
                source={anim} 
                style={{width: "100%", height: "100%"}} 
                autoPlay 
                loop
                />
            ),
            tabBarIcon:({})=>(
                <Icon name="user" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        
    </Tabs>
    );
};


export default TabsLayout;