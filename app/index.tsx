import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { encode as base64encode } from 'base-64';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import Store from 'src/stores/mobx';
import useLoading from 'src/useLoading';
import * as Animatable from 'react-native-animatable';
import { getAllStaticData } from "src/requests/userData";
import { statusDay } from "src/requests/timeManagement";
import * as Icons from '../assets';
import { router } from "expo-router";
const LoadingScreen = () => {
    return (
        <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={loadingStyles.Loading}
        >
            <Icons.loading width="55%" height="55%" />
        </Animatable.View>
    );
};

const authorize = observer(() => {
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const { loading, startLoading, stopLoading } = useLoading();
    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                const res = await getAllStaticData(token, true, false, false, false);
                if (res.status) {
                    Store.setTokenData(token);
                    router.push({ pathname: "/(tabs)/profile" });
                    statusDay(Store.userData.ID);
                } else {
                    setLoadingScreen(false);
                }
            } else {
                setLoadingScreen(false);
            }
        };
        checkToken();
    }, []);

    const buttonHandler = async () => {
        startLoading();
        if (login.length > 1 && password.length > 1) {
            const token = base64encode(`${login}:${password}`);
            const res = await getAllStaticData(token, true, false, false, false);
            if (res.status) {
                await SecureStore.setItemAsync('authToken', token);
                Store.setTokenData(token);
                router.push({ pathname: "/(tabs)/profile" });
                statusDay(Store.userData.ID);
            } else {
                Alert.alert("Ошибка авторизации", res.curError);
                setIsInvalidLogin(true);
            }
        } else {
            setIsInvalidLogin(true);
        }
        stopLoading();
    };

    const loginHandler = (value) => {
        setLogin(value);
        setIsInvalidLogin(false);
    };

    const passwordHandler = (value) => {
        setPassword(value);
        setIsInvalidLogin(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loadingScreen) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.Registration}>
            <View style={styles.frameParent}>
                <Text style={styles.welcomeText}>
                    <Text style={styles.welcomeTextRegular}>Приветствую вас в</Text>
                    <Text> </Text>
                    <Text style={styles.welcomeTextBold}>Martin Tools!</Text>
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={login}
                        placeholder='Введите логин'
                        onChangeText={loginHandler}
                        keyboardType={"ascii-capable"}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            placeholder='Введите пароль'
                            secureTextEntry={showPassword}
                            onChangeText={passwordHandler}
                        />
                        <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={buttonHandler} disabled={loading} style={styles.button}>
                    <Text style={styles.buttonText}>Войти</Text>
                </TouchableOpacity>
                {isInvalidLogin && <Text style={styles.errorText}>Неверные данные</Text>}
            </View>
        </View>
    );
});

const loadingStyles = StyleSheet.create({
    Loading: {
        backgroundColor: "#de283b",
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const styles = StyleSheet.create({
    frameParent: {
        width: '90%',
        alignSelf: 'center',
        marginTop: '20%',
        justifyContent: 'flex-start',
    },
    inputContainer: {
        width: '100%',
        marginTop: '10%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5%',
    },
    button: {
        backgroundColor: "#de283b",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '5%',
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    input: {
        backgroundColor: "#f7f8f9",
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        width: '100%',
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    errorText: {
        color: "#de283b",
        marginTop: 10,
        textAlign: "center",
    },
    welcomeText: {
        fontSize: 32,
        lineHeight: 42,
        fontWeight: "600",
        textAlign: "center",
        marginTop: '5%',
    },
    welcomeTextRegular: {
        color: "#191919",
    },
    welcomeTextBold: {
        color: "#de283b",
    },
    Registration: {
        backgroundColor: "#ebebeb",
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: 'flex-start',
    },
});

export default authorize;