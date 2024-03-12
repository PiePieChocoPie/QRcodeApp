import {Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions} from "react-native";
import React, {FC, useState} from "react";
import {encode as base64encode} from 'base-64';
import { storeAuthStatus } from "../store";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";

import {bitrixAuthRequest, bitrixDepRequest, bitrixUserRequest} from "../http";
import {Ionicons} from "@expo/vector-icons";
import authStore from "../authStoreDir";
import depStore from "../authStoreDir/depStore";

type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Authorize'>;
export const Authorize:FC =() => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState('');
    const [isInvalidLogin, setIsInvalidLogin] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(true);


    const navigation = useNavigation<AuthNavigationProp>();
    const buttonHandler = async () => {
        if (login.length > 1) {
            if (password.length > 1) {
                const token = base64encode(`${login}:${password}`);
                console.log(token)
                await bitrixAuthRequest(token)
                    .then(async (res) => {
                        if (res.data === true) {
                            await storeAuthStatus(token)
                                .then(async () => {
                                    await bitrixUserRequest(token)
                                        .then(async(res) =>{
                                            authStore.setUserData(res.data.result);
                                            await bitrixDepRequest(authStore.userData[0].UF_DEPARTMENT)
                                                .then(async (res)=>{
                                                    depStore.setDepData((res.data.result))
                                                    console.log(authStore.userData[0], depStore.depData[0]);
                                                    navigation.replace('Reader');
                                                })
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                    })
                                })
                        } else {
                            setIsInvalidLogin(true)
                        }
                    })
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
                <Button onPress={buttonHandler} title='Войти'/>
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