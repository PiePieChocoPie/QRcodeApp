import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { encode as base64encode } from 'base-64';
import * as SecureStore from 'expo-secure-store';
import { observer } from 'mobx-react-lite';
import Store from 'src/stores/mobx';
import useLoading from 'src/useLoading';
import * as Animatable from 'react-native-animatable';
import { getAllStaticData } from "src/requests/userData";
import { statusDay } from "src/requests/timeManagement";
import * as Icons from '../assets';
import { Link, router } from "expo-router";
import Button from 'src/components/button';
import { projColors } from 'src/stores/styles';

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

const PinInput = ({ pin, setPin, isError }) => {
    const handlePress = (num) => {
        if (pin.length < 4) {
            setPin(pin + num);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    return (
        <View style={pinStyles.pinContainer}>
            <View style={pinStyles.pinDisplay}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Animatable.View
                        key={index}
                        style={[
                            pinStyles.pinCircle,
                            isError && index >= pin.length ? pinStyles.pinCircleError : {}
                        ]}
                        animation={index < pin.length ? "pulse" : undefined}
                        duration={500}
                        iterationCount="infinite"
                    >
                        {index < pin.length ? <View style={pinStyles.pinFilled} /> : null}
                    </Animatable.View>
                ))}
            </View>
            <View style={pinStyles.numPad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={pinStyles.numButton}
                        onPress={() => handlePress(num.toString())}
                    >
                        <Text style={pinStyles.numButtonText}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <View style={pinStyles.underNumPad}>
                    <TouchableOpacity style={pinStyles.numButton} onPress={() => handlePress('0')}>
                        <Text style={pinStyles.numButtonText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={pinStyles.numButton} onPress={handleDelete}>
                        <Text style={pinStyles.numButtonText}>⌫</Text>
                    </TouchableOpacity>                    
                </View>
            </View>
        </View>
    );
};

const SavePinScreen = ({ onPinSaved }) => {
    const [pin, setPin] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const savePin = async () => {
            if (pin.length === 4) {
                await SecureStore.setItemAsync('userPin', pin);
                onPinSaved();
            } else {
                setIsError(true);
            }
        };

        if (pin.length === 4) {
            savePin();
        }
    }, [pin, onPinSaved]);

    return (
        <View style={pinStyles.Registration}>
            <View style={pinStyles.frameParent}>
                <Text style={pinStyles.welcomeText}>Сохраните PIN-код</Text>
                <PinInput pin={pin} setPin={setPin} isError={isError} />
            </View>
        </View>
    );
};

const CheckPinScreen = ({ onPinSuccess }) => {
    const [pin, setPin] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const handleCheckPin = async () => {
            const savedPin = await SecureStore.getItemAsync('userPin');
            if (pin === savedPin) {
                onPinSuccess();
            } else {
                setIsError(true);
                setPin('');
                Alert.alert("Ошибка", "Неверный PIN-код");
            }
        };

        if (pin.length === 4) {
            handleCheckPin();
        }
    }, [pin, onPinSuccess]);

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('authToken');
            Store.setTokenData(null);
            Store.setUserData(null);
            Store.setUserPhoto(null);
            router.push('/');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <View style={pinStyles.Registration}>
            <View style={pinStyles.frameParent}>
                <Text style={pinStyles.welcomeText}>Введите PIN-код</Text>
                <PinInput pin={pin} setPin={setPin} isError={isError} />
            </View>
            <View style={pinStyles.forgotPasswordContainer}>
                <Text style={pinStyles.forgotPasswordText} onPress={handleLogout}>Забыли пароль?</Text>
            </View>
        </View>
    );
};

const authorize = observer(() => {
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [showSavePin, setShowSavePin] = useState(false);
    const [showCheckPin, setShowCheckPin] = useState(false);
    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const checkPin = async () => {
            const pin = await SecureStore.getItemAsync('userPin');
            const token = await SecureStore.getItemAsync('authToken');
            if (pin && token) {
                setShowCheckPin(true);
                setLoadingScreen(false);
            } else {
                setLoadingScreen(false);
            }
        };
        checkPin();
    }, []);

    const buttonHandler = async () => {
        startLoading();
        if (login.length > 1 && password.length > 1) {
            const token = base64encode(`${login}:${password}`);
            const res = await getAllStaticData(token, true, false, false, false);
            console.log(token)
            if (res.status) {
                await SecureStore.setItemAsync('authToken', token);
                Store.setTokenData(token);
                setShowSavePin(true);
                setLoadingScreen(false);
            } else {
                Alert.alert("Ошибка авторизации", res.curError);
                setIsInvalidLogin(true);
            }
        } else {
            setIsInvalidLogin(true);
        }
        stopLoading();
    };

    const buttonForgotPasswordHandler = async () => {
        Linking.openURL("https://t.me/MartinUBot")
    };

    const buttonNewHandler = async () => {
        router.replace("./registration")
    };

    const handlePinSuccess = async () => {
        const token = await SecureStore.getItemAsync('authToken');
        const res = await getAllStaticData(token, true, false, false, false);
        if (res.status) {
            Store.setTokenData(token);
            router.replace("/(tabs)/profile");
            statusDay(Store.userData.ID);
        } else {
            Alert.alert("Ошибка", "Не удалось загрузить данные пользователя");
        }
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

    if (showSavePin) {
        return <SavePinScreen onPinSaved={handlePinSuccess} />;
    }

    if (showCheckPin) {
        return <CheckPinScreen onPinSuccess={handlePinSuccess} />;
    }

    return (
        <View style={styles.Registration}>
          <View style={styles.frameParent}>
            <Text style={styles.welcomeText}>
              <Text style={styles.welcomeTextRegular}>Вход</Text>
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
                    color={projColors.currentVerse.fontAlter}
                  />
                </TouchableOpacity>
              </View>
            </View>
    
            <Button handlePress={buttonHandler} title={'Войти'} disabled={loading} />
            <Button handlePress={buttonForgotPasswordHandler} title={'Забыли пароль?'} disabled={loading} backgroundColor={projColors.currentVerse.main} fontColor={projColors.currentVerse.redro} />
            <Button handlePress={buttonNewHandler} title={'Зарегистрироваться'} disabled={loading} backgroundColor={projColors.currentVerse.main} fontColor={projColors.currentVerse.font} />
    
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
const pinStyles = StyleSheet.create({
    Registration: {
        backgroundColor: "#ebebeb",
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: 'flex-start',
    },
    frameParent: {
        width: '90%',
        alignSelf: 'center',
        marginTop: '20%',
        justifyContent: 'flex-start',
    },
    welcomeText: {
        fontSize: 32,
        lineHeight: 42,
        fontWeight: "600",
        textAlign: "center",
        marginTop: '5%',
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    forgotPasswordText: {
        color: "#de283b",
        fontSize: 16,
    },
    welcomeTextRegular: {
        color: "#191919",
    },
    pinContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    pinDisplay: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    numPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: 250,
        alignSelf: 'center',
    },
    underNumPad:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        width: 250,
        alignSelf: 'center',
    },
    numButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f7f8f9',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    numButtonText: {
        fontSize: 24,
        color: '#000',
    },
    pinCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinCircleError: {
        borderColor: '#de283b', // Цвет границы при ошибке
    },
    pinFilled: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
});

const styles = StyleSheet.create({
    Registration: {
      backgroundColor: projColors.currentVerse.main, // Основной фон экрана
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: 160, // Пространство сверху
    },
    frameParent: {
      width: '90%',
      alignSelf: 'center',
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
    input: {
      backgroundColor: projColors.currentVerse.listElementBackground, // Фон полей ввода
      height: 50,
      borderRadius: 40,
      paddingHorizontal: 10,
      fontSize: 16,
      width: '100%',
    //   borderColor: projColors.currentVerse.border, // Граница полей
    //   borderWidth: 1,
      color: projColors.currentVerse.font, // Цвет текста
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    welcomeText: {
      fontSize: 32,
      lineHeight: 42,
      fontWeight: "600",
      textAlign: "left",
      marginTop: '5%',
    },
    welcomeTextRegular: {
      color: projColors.currentVerse.font, // Цвет текста
      textAlign:'left'
    },
    welcomeTextBold: {
      color: projColors.currentVerse.redro, // Цвет "Martin Tools!"
    },
    errorText: {
      color: projColors.currentVerse.redro, // Цвет ошибки
      marginTop: 10,
      textAlign: "center",
    },
  });

export default authorize;
