import React from "react";
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

function Profile() {
    const [userData, setUserData] = React.useState('');
    const [qrValue] = React.useState(Store.userData.ID);
    const { loading, startLoading, stopLoading } = useLoading();
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    // const [popupVisible, setPopupVisible] = React.useState(false);
    const {showPopup} = usePopupContext();
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
                                setUserData(`Имя: ${Store.userData.NAME}\n Фамилия: ${Store.userData.LAST_NAME}\n Должность: ${Store.userData.WORK_POSITION}\n Подразделение: ${Store.depData.NAME && Store.depData.NAME}`);
                                setPhotoUrl(Store.userPhoto);
                            } else {
                                setUserData(`${Store.userData.NAME} ${Store.userData.LAST_NAME}\n${Store.userData.WORK_POSITION}\n`);
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
                    
                    <View style={styles.buttonsContainer}>
                        <Button handlePress={toggleModal} title={'QR код сотрудника'} />
                        <Button
                            handlePress={handleLogout}
                            title={"123"}
                            icon={"address-card"}
                        />
                        
                    </View>

                    {/* {popupVisible && (
                        <Popup 
                            type={'info'}
                            message={'Я люблю печеньки очень сильно!'}
                            PopVisible={popupVisible}
                        />
                    )} */}
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
                        <QRCode value={qrValue} size={Dimensions.get('window').width - 100} color={projColors.currentVerse.font} />
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
        marginBottom: 24,
    },
    buttonsContainer: {
        width: '100%',
        paddingHorizontal: 32,
    },
});

export default Profile;
