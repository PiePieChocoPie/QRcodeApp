import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import useLoading from "./hooks/useLoading";
import {encode as base64encode} from 'base-64';
import Store from "./stores/mobx";
import {Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, Alert} from "react-native";
import { router } from "expo-router";
import { styles, projColors } from "./styles";
import { getAllStaticData } from "./stores/http";



const authorize =() =>{
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalidLogin, setIsInvalidLogin] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(true);
    const {loading, startLoading, stopLoading} = useLoading()

    const buttonHandler = async () => {
        startLoading()
        if (login.length > 1) {
            if (password.length > 1) {
                const token = base64encode(`${login}:${password}`);
                Store.setTokenData(token);
                console.log(Store.tokenData);
                
                await getAllStaticData(token)
                     .then(async (res) => {
                        // console.log(authStore.userData[0].WORK_POSITION)
                        router.replace('/(tabs)');
                     })
                     .catch(err =>{
                     Alert.alert("ошибка",'Ошибка авторизации: \n' +err);
                 })
            } else {
                setIsInvalidLogin(true)
            }
        }
        stopLoading()
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
            <View style={styles.fieldsContainer}>
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
export default authorize;