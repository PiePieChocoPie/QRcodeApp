import {statusDay } from "src/http";
import {Tabs} from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";

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
                <Text>{Store.statusWorkDay}</Text>
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
                <Text>{Store.statusWorkDay}</Text>
            ),
            tabBarIcon:({})=>(
                <Icon name="qrcode" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="profile"  options={{
            headerTitle: 'Профиль',
            title:"Профиль",
            headerRight: ({})=>(
                <Text>{Store.statusWorkDay}</Text>
            ),
            tabBarIcon:({})=>(
                <Icon name="user" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="calendar"  options={{
            headerTitle: 'календарь',
            title:"календарь",
            headerRight: ({})=>(
                <Text>{Store.statusWorkDay}</Text>
            ),
            tabBarIcon:({})=>(
                <Icon name="calendar" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
    </Tabs>
    );
};


export default TabsLayout;