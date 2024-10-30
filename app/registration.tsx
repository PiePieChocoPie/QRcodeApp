import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
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
import { router } from "expo-router";
import Button from 'src/components/button';
import { projColors } from 'src/stores/styles';
import axios from 'axios';
import { usePopupContext } from 'src/PopupContext';


const registration = observer(() => {
    const [login, setLogin] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');
    const [isInvalidLogin, setIsInvalidLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [isInvalid, setIsInvalid] = useState('');
    const { loading, startLoading, stopLoading } = useLoading();
    const { showPopup } = usePopupContext();
    const buttonHandler = async () => {
        startLoading();
        if(!login){
          setIsInvalid('login')
          return;
        }
        if(!mail.includes('@')){
          setIsInvalid('mail')
          return;
        }
        if(password.length<6){
          setIsInvalid('password')
          return;
        }
        if(password!==passwordCopy){
          setIsInvalid('passwordCopy')
          return;
        }
        let data = { 
          "username": login,
          "email": mail,
          "password": password };

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `https://bitrix24.martinural.ru/MuTools/register`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic cG52OjEyM1F3ZTEyMw==`
          },
          data: data,
          withCredentials: false
        };
    
        const response = await axios.request(config).then((res)=>
        {if(res.data.message = 'Пользователь зарегистрирован, пожалуйста, проверьте вашу почту для подтверждения')
        {
          showPopup('Пользователь зарегистрирован', 'success')
          router.replace('./')
        }
        }).catch((err) =>{
          showPopup('Проблема регистрации', 'error')
          console.log(err)
        })
        console.log(response)
        
        stopLoading();
    };

    const buttonNewHandler = async () => {
        router.replace("./")
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.Registration}>
          <View style={styles.frameParent}>
            <Text style={styles.welcomeText}>
              <Text style={styles.welcomeTextRegular}>Регистрация</Text>
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={login}
                placeholder='Придумайте логин'
                onChangeText={setLogin}
                keyboardType={"ascii-capable"}
              />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={mail}
                  placeholder='Введите почту'
                  onChangeText={setMail}
                  keyboardType={"ascii-capable"}
                />
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder='Придумайте пароль'
                  secureTextEntry={showPassword}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={projColors.currentVerse.fontAccent}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={passwordCopy}
                  placeholder='Повторите пароль'
                  secureTextEntry={showPassword}
                  onChangeText={setPasswordCopy}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={projColors.currentVerse.fontAccent}
                  />
                </TouchableOpacity>
              </View>
    
            <Button handlePress={buttonHandler} title={'Зарегистрироваться'} disabled={loading} />          
            <Button handlePress={buttonNewHandler} title={'Уже есть аккаунт'} disabled={loading} backgroundColor={projColors.currentVerse.main} fontColor={projColors.currentVerse.font} />
    
            {(()=>{switch(isInvalid) {
            case 'login':
            return <Text style={styles.errorText}>некорректный логин</Text>
            case 'mail':
            return <Text style={styles.errorText}>некорректный адрес электронной почты</Text>
            case 'password':
            return <Text style={styles.errorText}>проверьте пароль</Text>
            case 'passwordCopy':
            return <Text style={styles.errorText}>проверьте повтор пароля</Text>
            }})()}
          </View>
        </View>
      );
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
      marginTop: '5%',
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
    underButtonText:{
      color: projColors.currentVerse.border, // Цвет текста
      fontSize: 13,
      textAlign:'center'
    },
    linkText:{
      color: projColors.currentVerse.redro, // Цвет текста
      fontSize: 13,
      textAlign:'center'
    },
  });

export default registration;
