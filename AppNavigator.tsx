import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Authorize} from "./screens/Authorize";
import Reader from "./screens/Reader";
import {RootStackParamList} from "./types/navigation";
import MainPage from "./screens/MainPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName={'Authorize'} screenOptions={{headerBackVisible: false, animation:"fade"}}>
            <Stack.Screen name="Authorize"  component={Authorize} options={{ title: 'Авторизация', headerTintColor:'#fff', headerShown:false}}/>
            <Stack.Screen name="Reader" component={Reader} options={{ title: 'Чтение QR', headerTintColor:'#fff', headerShown:false}}/>
            <Stack.Screen name="MainPage" component={MainPage} options={{title: 'QR-Идентификация', headerTintColor:'#fff', headerShown:false}}/>
        </Stack.Navigator>
    );
}

export default AppNavigator;
