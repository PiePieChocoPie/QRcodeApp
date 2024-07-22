import React from "react";
import { View, Text, Alert, Dimensions, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { storeAuthStatus } from 'src/secStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Store from "src/stores/mobx";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import CustomModal from "src/components/custom-modal"; 
import QRCode from "react-native-qrcode-svg";
import { openDay, statusDay } from "src/requests/timeManagement";
import { getAllStaticData } from "src/requests/userData";
import Button from 'src/components/button'
import Popup from 'src/components/popup'
function Profile() {
    const [userData, setUserData] = React.useState('');
    const [qrValue] = React.useState(Store.userData.ID);
    const { loading, startLoading, stopLoading } = useLoading();
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [popupVisible, setPopupVisible] = React.useState(false);

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

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const activePOP = () => {
        setPopupVisible(true)
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    startLoading();
                    await getAllStaticData(Store.tokenData, false, true, false, false)
                        .then(async (res) => {
                            if (res.status) {
                                setUserData(`${Store.userData.NAME} ${Store.userData.LAST_NAME}\n${Store.userData.WORK_POSITION}\n${Store.depData.NAME && Store.depData.NAME}`);
                                setPhotoUrl(Store.userPhoto);
                            } else {
                                setUserData(`${Store.userData.NAME} ${Store.userData.LAST_NAME}\n${Store.userData.WORK_POSITION}\n`);
                                setPhotoUrl(Store.userPhoto);
                            }
                        })
                        .catch(err => {
                            Alert.alert("Ошибка", 'Ошибка: \n' + err);
                        });
                } catch (error) {
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
                    <Text style={[styles.Text, { textAlign: "center" }]}>{userData}</Text>
    
                    <Button handlePress={handleLogout} title={'Выйти из аккаунта'}/>

                    <Button handlePress={toggleModal} title={'QR код сотрудника'}/>

                    <Button
                        handlePress={activePOP}
                        title={'вызвать попку'}
                    />
                    {
                        popupVisible && (
                            <Popup 
                            type={'warning'}
                            message={'Я робот долбоёб!'}
                            
                            />
                        )
                    }

                </View>
            <CustomModal
                visible={modalVisible}
                onClose={toggleModal}
                marginTOP={0.2} 
                title={"QR - Code"} 
                content={
                    <View 
                        style={styles.modalContent}
                    >
                        <QRCode value={qrValue} size={Dimensions.get('window').width - 100} color={projColors.currentVerse.font} />
                    </View>
                }
            />
        </View>
    );
}

export default Profile;
