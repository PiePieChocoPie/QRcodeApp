
import {Tabs} from "expo-router";

const TabsLayout = () => {
    return (
    <Tabs>
        <Tabs.Screen name ="reader" options={{
            headerTitle: 'Сканер QR',
            title:"Сканер",
        }}/>
        <Tabs.Screen name ="tasks" options={{
            headerTitle: 'Задачи',
            title:"Задачи",
        }}/>
        <Tabs.Screen name ="profile" options={{
            headerTitle: 'Профиль',
            title:"Профиль",
        }}/>
        
    </Tabs>
    );
};

export default TabsLayout;