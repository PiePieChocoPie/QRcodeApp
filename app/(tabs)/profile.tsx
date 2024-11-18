import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Dimensions, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Linking, ImageBackground } from 'react-native';
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import Store from "src/stores/mobx";
import { projColors } from "src/stores/styles";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useLoading from "src/useLoading";
import Button from 'src/components/button';
import QRCode from "react-native-qrcode-svg";
import { openDay, statusDay, closeDay } from "src/requests/timeManagement";
import { getAllStaticData } from "src/requests/userData";
import CustomModal from "src/components/custom-modal";
import Calendar from '../../src/components/calendar';
import { usePopupContext } from "src/PopupContext";
import * as Icon from 'assets/icons/profileIcons';
import useFonts from 'src/useFonts';
const pic = require('./pic.jpg');

function Profile() {
    const [userData, setUserData] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [calenVisible, setCalendVisible] = useState(false);
    const [workStatusLocal, setWorkStatusLocal] = useState(null);
    const { loading, startLoading, stopLoading } = useLoading();
    const { showPopup } = usePopupContext();
    const idUser = Store.userData ? Store.userData.ID : 1;
    const fontsLoaded = useFonts();
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                startLoading();
                try {
                    const res = await getAllStaticData(Store.tokenData, false, true, false, false);
                    if (res.status) {
                        setUserData(`${Store.userData.NAME} ${Store.userData.LAST_NAME}`);
                        setUserPosition(`${Store.userData.WORK_POSITION}`);
                        setPhotoUrl(Store.userPhoto);
                    }
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

    const checkWorkStatus = async () => {
        const response = await statusDay(idUser);
        setWorkStatusLocal(Store.statusWorkDay);

    }

    const handleLogout = async () => {
        Alert.alert(
            'Подтверждение',
            'Вы уверены, что хотите выйти из аккаунта?',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Выйти из аккаунта', style: 'destructive', onPress: async () => {
                    await SecureStore.deleteItemAsync('authToken');
                    Store.setTokenData(null);
                    Store.setUserData(null);
                    Store.setUserPhoto(null);
                    router.push('/');
                }}
            ]
        );
    };

    const handleOpenWorkDay = async () => {
        await openDay(idUser);
        await checkWorkStatus();
        if (Store.statusWorkDay === 'OPENED') showPopup('Рабочий день открыт', 'success');
    };

    const handleCloseWorkDay = async () => {
        await closeDay(idUser);
        await checkWorkStatus();
        if (Store.statusWorkDay === 'CLOSED') showPopup('Рабочий день закрыт', 'info');
    };

    return (
        <ImageBackground source={pic} style={{ flex: 1 }} imageStyle={{ resizeMode: 'cover' }}>
            {loading||!fontsLoaded ? (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.overlayWithUser}>
                        <View style={styles.avatarContainer}>
                            {photoUrl ? (
                                <Image source={{ uri: photoUrl }} style={styles.avatar} />
                            ) : (
                                <Icon.plug size={40} color={projColors.currentVerse.font} />
                            )}
                        </View>
                        <Text style={styles.userInfo}>{userData}</Text>
                        <Text style={styles.position}>{userPosition}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.touchableComponent}>
                            <Icon.calendar size={24} color={projColors.currentVerse.font} />
                            <Text style={styles.Text}>QR-код</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={workStatusLocal === 'CLOSED' ? handleOpenWorkDay : handleCloseWorkDay} style={styles.touchableComponent}>
                            <Icon.workStatus size={24} color={projColors.currentVerse.font} />
                            <Text style={styles.Text}>Рабочий статус</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.touchableComponent}>
                            <Icon.logOut size={24} color={projColors.currentVerse.font} />
                            <Text style={styles.Text}>Выход</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCalendVisible(true)} style={styles.touchableComponent}>
                            <Icon.calendar size={24} color={projColors.currentVerse.font} />
                            <Text style={styles.Text}>Календарь</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contactContainer}>
                        <Icon.mail size={16} color={projColors.currentVerse.fontAccent} style={styles.icon} />
                        <Text style={styles.contactText}>Email: {Store.userData.EMAIL}</Text>
                    </View>
                    <View style={styles.contactContainer}>
                        <Icon.phone size={16} color={projColors.currentVerse.fontAccent} style={styles.icon} />
                        <Text style={styles.contactText}>Телефон: {Store.userData.PERSONAL_MOBILE}</Text>
                    </View>
                    <View style={styles.contactContainer}>
                        <Icon.birth size={16} color={projColors.currentVerse.fontAccent} style={styles.icon} />
                        <Text style={styles.contactText}>Дата рождения: {Store.userData.PERSONAL_BIRTHDAY}</Text>
                    </View>
                    <CustomModal
                        visible={modalVisible}
                        marginTOP={0.2}
                        onClose={() => setModalVisible(false)}
                        title={"QR - Code"}
                        content={<QRCode value={idUser} size={Dimensions.get('window').width - 100} color={projColors.currentVerse.font} />}
                    />
                    <CustomModal
                        visible={calenVisible}
                        marginTOP={0.2}
                        onClose={() => setCalendVisible(false)}
                        title={"Календарь"}
                        content={<Calendar />}
                    />
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: projColors.currentVerse.main,
    },
    overlayWithUser: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatarContainer: {
        borderColor: projColors.currentVerse.border,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 10,
    },
    avatar: {
        width: 120,
        height: 120,
    },
    userInfo: {
        fontSize: 22,
        color: projColors.currentVerse.redro,
        textAlign: 'center',
        fontFamily: "boldFont"
    },
    position: {
        fontSize: 16,
        color: projColors.currentVerse.redro,
        textAlign: 'center',
        fontFamily: "baseFont"

    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    contactContainer: {
        backgroundColor: projColors.currentVerse.listElementBackground,
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
        color: projColors.currentVerse.fontAccent,
    },
    contactText: {
        fontSize: 16,
        color: projColors.currentVerse.font,
        fontFamily: "baseFont"
    },
    Text:{
        fontSize: 16,
        color: projColors.currentVerse.font,
        fontFamily: "baseFont"

    },
    touchableComponent:{
        alignItems:'center'
    }
});

export default Profile;
