import { View, Text, Alert, Dimensions, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Store from "src/stores/mobx";
import { projColors } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import ModalForm from "src/modals/modal";
import Button from 'src/components/button';
import Popup from 'src/components/popup';
import QRCode from "react-native-qrcode-svg";
import { openDay, statusDay } from "src/requests/timeManagement";
import { getAllStaticData } from "src/requests/userData";
import CustomModal from "src/components/custom-modal";
import { usePopupContext } from "src/PopupContext";
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import asif from 'src/asif.json';

function Profile() {
    const [userData, setUserData] = React.useState('');
    const [userPosition, setUserPosition] = React.useState('');
    const [userDep, setUserDep] = React.useState('');
    const [idUser] = React.useState(Store.userData.ID);
    const { loading, startLoading, stopLoading } = useLoading();
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [workStatusLocal, setWorkStatusLocal] = React.useState(null);
    // const [popupVisible, setPopupVisible] = React.useState(false);
    const {showPopup} = usePopupContext();
    
    useFocusEffect(
        React.useCallback(() => {
            
        try {
            statusDay(idUser);
            console.log(Store.statusWorkDay)
            setWorkStatusLocal(Store.statusWorkDay);

        } catch (e) {
          console.log('Ошибка с timeman')
        }
        }, [])
    );
//     useEffect(() => {
//         const intervalId = setInterval(async () => {
//         try {

//         console.log(123123)
//         } catch (error) {
//         console.log('Ошибка:', error);
//         }
//         }, 1000); // вызывать каждую секунду

//     return () => clearInterval(intervalId); // очистить интервал при размонтировании компонента
// }, [idUser]);
    const handleLogoutConfirmation = async () => {
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
      
      const handleLogout = async () => {
        Alert.alert(
          'Подтверждение',
          'Вы уверены, что хотите выйти из аккаунта?',
          [
            {
              text: 'Отмена',
              style: 'cancel',
            },
            {
              text: 'Выйти из аккаунта',
              style: 'destructive',
              onPress: handleLogoutConfirmation,
            },
          ],
          { cancelable: false }
        );
      };


    const toggleModal = () => {
        // const a = "123"
        setModalVisible(!modalVisible);
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    startLoading();
                    await getAllStaticData(Store.tokenData, false, true, false, false)
                        .then(async (res) => {
                            if (res.status) {
                                setUserData(`${Store.userData.NAME} ${Store.userData.LAST_NAME}`);
                                setUserPosition(`${Store.userData.WORK_POSITION}`)
                                setPhotoUrl(Store.userPhoto);
                            } else {
                                setUserData(`${Store.userData.NAME} ${Store.userData.LAST_NAME}`);
                                setUserPosition(`${Store.userData.WORK_POSITION}`);
                                setPhotoUrl(Store.userPhoto);
                            }
                        })
                        .catch(err => {
                            showPopup(`Ошибка:\n${err}`, "error");
                            console.error('Ошибка:', err);

                        });
                } catch (error) {
                    showPopup(`Ошибка:\n${error}`, "error");
                    console.error('Ошибка:', error);
                } finally {
                    stopLoading();
                }
            };
            fetchData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View>
            {
                workStatusLocal === 'OPENED' && (
                    <LottieView
                    source={asif}
                    autoPlay
                    loop
                    style={styles.active}
                />
                )
            }
                <View style={[styles.overlayWithUser, { margin: "7%" }]}>
                    <View style={styles.avatarContainer}>
                        {photoUrl ? (
                            <Image source={{ uri: photoUrl }} style={styles.avatar} />
                        ) : (
                            <Icon name="user-o" size={40} color={projColors.currentVerse.font} />
                        )}
                    </View>
                </View>
                <Text style={styles.userInfo}>{userData}</Text>
                <Text style={styles.position}>{userPosition}</Text>
                <View style={styles.buttonsContainer}>
                    <Button 
                        handlePress={toggleModal} 
                        title={''}
                        icon={"qrcode"} />
                    <Button
                        handlePress={() => console.log('Settings button pressed')} // обработчик события для кнопки настройки
                        title={''}
                        icon={"gear"} />
                    <Button
                        handlePress={handleLogout}
                        title={''}
                        icon={"power-off"}/>   
                </View>
                <Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                        {'\n\n\n\nГород: '}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>
                        {Store.userData.PERSONAL_CITY}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                        {'\n\nПодразделение: '}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>
                        {Store.depData.NAME}
                    </Text> 
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                        {' \n\nПочта: '}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>
                        {Store.userData.EMAIL}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                        {' \n\nЛичный номер: '}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>
                        {Store.userData.PERSONAL_MOBILE}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                        {' \n\nДата Рождения: '}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'black' }}>
                        {Store.userData.PERSONAL_BIRTHDAY}
                    </Text>
                </Text>
            </View>
            <CustomModal
                visible={modalVisible}
                onClose={toggleModal}
                marginTOP={0.2} 
                title={"QR - Code"} 
                content={
                    <View 
                        // style={styles.modalContent}
                    >                        
                        <QRCode value={idUser} size={Dimensions.get('window').width - 100} color={projColors.currentVerse.font} /> 
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlayWithUser: {
        alignItems: "center",
      },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        borderWidth: 4,
        borderColor: projColors.currentVerse.border,
        borderRadius: 100,
        overflow: 'hidden',
        marginBottom: 16,
        
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    userInfo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: projColors.currentVerse.text,
        textAlign: 'center',
        

    },
    buttonsContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    pressed: {
        backgroundColor: 'orange',
    },
    active: {
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        right: 0,
        top: 20,
    },
    position: {
        fontSize: 15,
        fontWeight: 'normal',
        color: projColors.currentVerse.text,
        textAlign: 'center',
        marginBottom: 50,
        opacity: 0.7,
    },
    department: {
        fontSize: 15,
        fontWeight: 'normal',
        color: projColors.currentVerse.text,
        textAlign: 'left',
        marginBottom: 20,
        opacity: 0.7,
    }
});

export default Profile;