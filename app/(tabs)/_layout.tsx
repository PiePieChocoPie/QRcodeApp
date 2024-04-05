
import {Tabs} from "expo-router";

const TabsLayout = () => {
    return (
    <Tabs>
        <Tabs.Screen name ="reader" options={{
            headerTitle: 'reader',
            title:"Сканер",
        }}/>
        <Tabs.Screen name ="tasks" options={{
            headerTitle: 'task',
            title:"Задачи",
        }}/>
    </Tabs>
    );
};

export default TabsLayout;