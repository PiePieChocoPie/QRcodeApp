import { Tabs } from "expo-router";

const TabsLayout =()=>{
    return <Tabs>
        <Tabs.Screen name="tasks" options={{
            headerTitle:"задачи"
        }}/>
        <Tabs.Screen name="reader" options={{
            headerTitle: "сканер",
        }}/>
 
    </Tabs>
}
export default TabsLayout;