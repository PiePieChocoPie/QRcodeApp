
import {Tabs} from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { projColors } from "src/stores/styles";

const TabsLayout = () => {
    return (
    <Tabs>
        <Tabs.Screen name ="tasks" options={{
            headerTitle: 'Задачи',
            title:"Задачи",
            tabBarIcon:({})=>(
                <Icon name="tasks" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="reader" options={{
            headerTitle: 'Сканер QR',
            title:"Сканер",
            tabBarIcon:({})=>(
                <Icon name="qrcode" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        <Tabs.Screen name ="profile" options={{
            headerTitle: 'Профиль',
            title:"Профиль",
            tabBarIcon:({})=>(
                <Icon name="user" size={25} color={projColors.currentVerse.font}/>
            ),
        }}/>
        
    </Tabs>
    );
};

export default TabsLayout;