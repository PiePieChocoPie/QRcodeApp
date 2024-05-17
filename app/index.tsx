import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {encode as base64encode} from 'base-64';
import {Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, Alert} from "react-native";
import { router } from "expo-router";
//
import { styles, projColors } from "src/stores/styles";
import { getAllStaticData, statusDay, getStorages } from "src/http";
import Store from "src/stores/mobx";
import useLoading from "src/useLoading";

const authorize =() =>{
    const [login, setLogin] = useState('arm');
    const [password, setPassword] = useState('Zxc123');
    const [isInvalidLogin, setIsInvalidLogin] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(true);
    const {loading, startLoading, stopLoading} = useLoading()
    const buttonHandler = async () => {
        startLoading()
        if (login.length > 1) {
            if (password.length > 1) {
                const token = base64encode(`${login}:${password}`);
                Store.setTokenData(token);
                
                await getAllStaticData(token, true, false, false, false)
                     .then(async (res) => {
                        if(res.status){
                            router.push({pathname:"/(tabs)/profile"});
                            console.log("store = "+ Store.userData.ID)
                            statusDay(Store.userData.ID);
                        }  
                        else Alert.alert("Ошибка авторизации", res.curError);
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