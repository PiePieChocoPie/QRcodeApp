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
import { Button } from "react-native-paper";
import ModalForm from "src/modals/modal"; // Updated import
import QRCode from "react-native-qrcode-svg";
import { openDay, statusDay } from "src/requests/timeManagement";
import { getAllStaticData } from "src/requests/userData";

function Profile() {
    const [userData, setUserData] = React.useState('');
    const [qrValue] = React.useState(Store.userData.ID);
    const { loading, startLoading, stopLoading } = useLoading();
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

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

    const updateStatus = () => {
        statusDay(Store.userData.ID);
    };

    const startDay = async () => {
        try {
            const response = await openDay(Store.userData.ID);
        } catch (error) {
            console.error('Ошибка:', error);
        }
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
            {loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
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
                    <TouchableOpacity style={styles.opacities} onPress={handleLogout}>
                        <Icon name="user-times" size={40} color={projColors.currentVerse.font} />
                        <Text style={styles.Text}>Выход</Text>
                    </TouchableOpacity>
                    <Button onPress={toggleModal}>
                        <Text style={styles.Text}>
                            Просмотр QR-кода
                        </Text>
                    </Button>
                </View>
            )}
            <ModalForm
                modalVisible={modalVisible}
                toggleModal={toggleModal}
                ID={Store.userData.ID}
            />
        </View>
    );
}

export default Profile;
