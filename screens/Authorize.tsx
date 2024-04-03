import {Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, ActivityIndicator, Alert} from "react-native";
import React, {FC, useState} from "react";
import {encode as base64encode} from 'base-64';
import { storeAuthStatus } from "../secStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";

import {getAllStaticData} from "../http";
import {Ionicons} from "@expo/vector-icons";
import authStore from "../stores/authStore";
import useLoading from "../hooks/useLoading";

type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Authorize'>;
export const Authorize:FC =() => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState('');
    const [isInvalidLogin, setIsInvalidLogin] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(true);
    const [test, setTest] = useState({});
    const {loading, startLoading, stopLoading} = useLoading()

    const navigation = useNavigation<AuthNavigationProp>();
    const buttonHandler = async () => {
        startLoading()
        if (login.length > 1) {
            if (password.length > 1) {
                const token = base64encode(`${login}:${password}`);
                authStore.setTokenData(token);
                console.log(authStore.tokenData)
                await getAllStaticData(token)
                    .then(async (res) => {
                        console.log(authStore.userData[0].WORK_POSITION)
                        if(res==false)
                        {
                        Alert.alert("Непредвиденная ошибка","Что-то пошло не так!")
                        }else 
                        navigation.replace('MainPage');
                    })
                    .catch(err =>{
                    Alert.alert("ошибка",'Ошибка авторизации: \n' +err);
                })
                stopLoading()
            } else {
                setIsInvalidLogin(true)
            }
        }
    }
    

    const loginHandler = (value: string) => {
        setLogin(value)
        setIsInvalidLogin(false)
    }

    const passwordHandler = (value: string) => {
        setPassword(value)
        setIsInvalidLogin(false)
    }



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.authContainer}>
            <View style={styles.authContainer1}>
                <TextInput style={styles.input}
                           value={login}
                           placeholder='Логин'
                           onChangeText={loginHandler}
                           keyboardType={"ascii-capable"}
                />
                <TextInput style={styles.input}
                           value={password}
                           placeholder='Пароль'
                           secureTextEntry={showPassword}
                           onChangeText={passwordHandler}
                />
                <TouchableOpacity
                    onPress={togglePasswordVisibility}
                >
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>

                {<Button onPress={buttonHandler} color={'brown'} title='Войти' disabled={loading}/>}
                {isInvalidLogin && <Text>Неверные данные</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    authContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    authContainer1: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: Dimensions.get("window").height /6
    },
    input: {
        marginTop: 20,
        width: 300,
        height: 50,
        borderStyle: 'solid',
        borderTopColor: 'red',
        borderTopWidth: 2,
        borderBottomColor: 'red',
        borderBottomWidth: 2,
    }
});