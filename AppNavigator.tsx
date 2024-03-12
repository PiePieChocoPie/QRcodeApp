import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Authorize} from "./screens/Authorize";
import Reader from "./screens/Reader";
import {RootStackParamList} from "./types/navigation";
import QRPage from "./screens/QRPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName={'Authorize'} screenOptions={{headerBackVisible: false, animation:"fade", headerStyle:{backgroundColor:"#333"}}}>
            <Stack.Screen name="Authorize"  component={Authorize} options={{ title: 'Авторизация', headerTintColor:'#fff', }}/>
            <Stack.Screen name="Reader" component={Reader} options={{ title: 'Чтение QR', headerTintColor:'#fff', }}/>
            <Stack.Screen name="QRPage" component={QRPage} options={{title: 'QR-Идентификация', headerTintColor:'#fff',}}/>
        </Stack.Navigator>
    );
}

export default AppNavigator;
