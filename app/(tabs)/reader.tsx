import React, { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/hooks/useLoading";
import LottieView from 'lottie-react-native';
import anim2 from 'src/anim2.json';
import { getAllStaticData } from "src/requests/userData";
import { usePopupContext } from "src/hooks/popup/PopupContext";
import useNetworkStatus from "src/hooks/networkStatus/useNetworkStatus";
import { addToArray, findObjectById } from "src/stores/asyncStorage";
import CustomModal from "src/components/custom-modal";

const Reader = () => {
    // Состояния компонента
    const [scanned, setScanned] = useState(false); // Отвечает за то, был ли код уже отсканирован
    const [modalVisibleAD, setModalVisibleAD] = useState(false); // Отображение модального окна
    const { loading, startLoading, stopLoading } = useLoading(); // Управление состоянием загрузки
    const [permission, requestPermission] = useCameraPermissions(); // Запрос прав на доступ к камере
    const { showPopup } = usePopupContext(); // Всплывающие сообщения
    const [doc, setDoc] = useState(null); // Состояние для документа
    const [docId, setDocId] = useState(''); // ID документа
    const isConnected = useNetworkStatus(); // Проверка состояния сети

    // Запрашиваем разрешение на использование камеры при монтировании компонента
    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await requestPermission();
            return status === "granted";
        };
        getCameraPermissions().then(requestPermission);
    }, []);

    // Вызов функции fetchData при фокусе на компоненте
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    // Функция получения всех данных с сервера и их обработки
    const fetchData = async () => {
        try {
            startLoading(); // Включаем индикатор загрузки
            await getAllStaticData(Store.tokenData, false, false, false, true, isConnected)
                .then(async (res) => {
                    if (!res.status) {
                        Alert.alert("Ошибка", res.curError); // Если есть ошибка, выводим предупреждение
                    }
                })
                .catch(err => {
                    Alert.alert("ошибка", 'Ошибка: \n' + err); // Обработка ошибок
                });
        } catch (error) {
            console.error('ошибка:', error);
        } finally {
            stopLoading(); // Останавливаем индикатор загрузки
        }
    };

    // Добавление объекта в историю (в asyncStorage)
    const addObjInStory = async (id) => {
        let date = new Date();
        addToArray('scanDocArray',{ id_time: `${id}_${date}` });
    };

    // Обработка события сканирования QR-кода
    const handleBarCodeScanned = async ({ data }) => {
        try {
            setScanned(true); // Устанавливаем состояние "сканировано"
            if (data.includes('$')) {
                let obj = findObjectById('scanDocArray',data); // Ищем объект в хранилище по ID
                setDoc(obj);
                setDocId(data);
                if (obj == null) {
                    addObjInStory(data); // Если объект не найден, добавляем его в хранилище
                } else {
                    setModalVisibleAD(true); // Показываем модальное окно, если объект найден
                }
            } else {
                showPopup('неизвестный тип документа', 'error');
            }
        } catch (error) {
            console.error("Ошибка при сканировании кода:", error);
            showPopup(`Ошибка сканирования: ${error.message}`, 'error');
        } finally {
            setTimeout(() => {
                setScanned(false); // Сбрасываем состояние через 500мс, чтобы можно было сканировать новый код
            }, 500);
        }
    };

    // Переключение видимости модального окна AD
    const toggleModalAD = () => {
        setModalVisibleAD(!modalVisibleAD);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <View style={styles.overlay}>
                    <CameraView
                        style={styles.camera}
                        facing={'back'}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        mute
                    >
                        <LottieView
                            source={anim2}
                            style={{ width: "100%", height: "100%" }}
                            autoPlay
                            loop
                        />
                    </CameraView>
                    <CustomModal
                        visible={modalVisibleAD}
                        onClose={toggleModalAD}
                        marginTOP={0.2}
                        title={`В списке уже есть документ с таким идентификитором,\nвы действительно хотите снова внести - ${doc.title? doc.title : doc.id_time}?`}
                        content={
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ flex: 1, width: '40%' }}
                                    onPress={() => addObjInStory(docId)}
                                >
                                    <View style={styles.okButton}>
                                        <Text style={styles.Title}>ОК</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, width: '40%' }}
                                    onPress={toggleModalAD}
                                >
                                    <View style={styles.cancelButton}>
                                        <Text style={styles.Title}>Отмена</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main,
    },
    containerCentrallity: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
    },
    Title: {
        fontSize: 16,
        color: projColors.currentVerse.fontAccent,
    },
    okButton: {
        backgroundColor: '#d2ff41',
        margin: '10%',
        padding: 10,
        alignContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    cancelButton: {
        backgroundColor: '#db6464',
        margin: '10%',
        padding: 10,
        alignContent: "center",
        alignItems: "center",
        borderRadius: 20,
    }
});

export default Reader;
