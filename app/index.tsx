import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { encode as base64encode } from 'base-64';
import { Text, TextInput, View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getAllStaticData, statusDay } from "src/http";
import Store from "src/stores/mobx";
import useLoading from "src/useLoading";
import { Image } from "expo-image";
import * as Animatable from 'react-native-animatable';

const LoadingScreen = () => {
    return (
        <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            style={loadingStyles.Loading}
        >
            <Image
                style={loadingStyles.LoadingChild}
                contentFit="cover"
                source={require("../assets/Loading.png")}
            />
        </Animatable.View>
    );
};

const authorize = () => {
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [login, setLogin] = useState('arm');
    const [password, setPassword] = useState('Zxc123');
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingScreen(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const buttonHandler = async () => {
        startLoading();
        if (login.length > 1) {
            if (password.length > 1) {
                const token = base64encode(`${login}:${password}`);
                Store.setTokenData(token);
                
                await getAllStaticData(token, true, false, false, false)
                    .then(async (res) => {
                        if (res.status) {
                            router.push({ pathname: "/(tabs)/profile" });
                            statusDay(Store.userData.ID);
                        } else {
                            Alert.alert("Ошибка авторизации", res.curError);
                        }
                    })
                    .catch(err => {
                        Alert.alert("Ошибка авторизации", 'Ошибка авторизации: \n' + err);
                    });
            } else {
                setIsInvalidLogin(true);
            }
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
            <View style={[styles.frameParent, styles.frameParentLayout]}>
                <View style={styles.frameGroup}>
                    <TouchableOpacity onPress={buttonHandler} disabled={loading} style={styles.button}>
                        <Text style={[styles.text, styles.textPosition]}>Войти</Text>
                    </TouchableOpacity>
                    <View style={[styles.enterYourEmailInput, styles.martinToolsPosition]}>
                        <View style={[styles.enterYourEmailWrapper, styles.enterPosition]}>
                            <TextInput
                                style={[styles.input, styles.centeredText]}
                                value={login}
                                placeholder='Введите логин'
                                onChangeText={loginHandler}
                                keyboardType={"ascii-capable"}
                            />
                        </View>
                        <View style={[styles.enterYourEmailInput1, styles.enterPosition]}>
                            <TextInput
                                style={[styles.input, styles.centeredText]}
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
                </View>
                {isInvalidLogin && <Text style={styles.errorText}>Неверные данные</Text>}
                <Text style={[styles.martinTools, styles.martinToolsFlexBox]}>
                    <Text style={styles.text1}>Приветсвую вас в</Text>
                    <Text style={styles.blankLine}> </Text>
                    <Text style={styles.martinTools1}>Martin Tools!</Text>
                </Text>
            </View>
        </View>
    );
};

const loadingStyles = StyleSheet.create({
    LoadingChild: {
        position: "absolute",
        top: 337,
        left: 108,
        width: 177,
        height: 177,
    },
    Loading: {
        backgroundColor: "#de283b",
        flex: 1,
        width: "100%",
        height: 852,
        overflow: "hidden",
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const styles = StyleSheet.create({
    frameParentLayout: {
        width: 345,
        position: "absolute",
    },
    textPosition: {
        left: "50%",
        top: "50%",
    },
    martinToolsPosition: {
        top: 0,
        left: 0,
    },
    enterPosition: {
        backgroundColor: "#f7f8f9",
        height: 65,
        borderRadius: 10,
        left: "50%",
        top: "50%",
        marginLeft: -172.5,
        width: 345,
        position: "absolute",
    },
    martinToolsFlexBox: {
        textAlign: "left",
        position: "absolute",
    },
    text: {
        marginTop: -11.5,
        marginLeft: -27.5,
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        textAlign: "center",
        position: "absolute",
        left: "50%",
        top: "50%",
    },
    wrapper: {
        marginTop: 57.5,
        backgroundColor: "#de283b",
        height: 65,
        borderRadius: 10,
        marginLeft: -172.5,
        left: "50%",
        top: "50%",
        width: 345,
        position: "absolute",
        overflow: "hidden",
    },
    enterYourEmail: {
        marginTop: -9.6,
        marginLeft: -153.7,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "500",
        color: "#8391a1",
        left: "50%",
        top: "50%",
    },
    enterYourEmailWrapper: {
        marginTop: -72.5,
    },
    enterYourEmailInput1: {
        marginTop: 7.5,
    },
    enterYourEmailInput: {
        height: 145,
        width: 345,
        position: "absolute",
    },
    frameGroup: {
        top: 115,
        height: 245,
        left: 0,
        width: 345,
        position: "absolute",
    },
    text1: {
        color: "#191919",
    },
    blankLine: {
        color: "#000",
    },
    martinTools1: {
        color: "#de283b",
    },
    martinTools: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: "600",
        top: 0,
        left: 0,
    },
    frameParent: {
        top: 48,
        left: 24,
        height: 360,
    },
    Registration: {
        backgroundColor: "#ebebeb",
        flex: 1,
        width: "100%",
        height: 852,
        overflow: "hidden",
    },
    input: {
        fontSize: 20,
        lineHeight: 20,
        fontWeight: "500",
        color: "#8391a1",

    },
    centeredText: {
        height: '100%',
        justifyContent: 'center', // Center text vertically

        paddingHorizontal: 10,
    },
    eyeIcon: {
        position: "absolute",
        right: 20,
        top: "50%",
        marginTop: -12,
    },
    button: {
        marginTop: 180,
        backgroundColor: "#de283b",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    errorText: {
        color: "#de283b",
        marginTop: 10,
        textAlign: "center",
    },
});

export default authorize;
