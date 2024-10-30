import React, { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, Alert, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";
import Toast from 'react-native-root-toast';
import LottieView from 'lottie-react-native';
import anim2 from 'src/anim2.json';
import { getAllStaticData } from "src/requests/userData";
import { getDataAboutDocs } from "src/requests/docs";
import { usePopupContext } from "src/PopupContext";

const Reader = () => {
    const [scanned, setScanned] = useState(false);
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const { loading, startLoading, stopLoading } = useLoading();
    const [permission, requestPermission] = useCameraPermissions();
    const { showPopup } = usePopupContext();

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await requestPermission();
            return status === "granted";
        };
        getCameraPermissions().then(requestPermission);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    );

    useEffect(() => {
        console.log(scanned)
    }, []);

    const fetchData = async () => {
        try {
            startLoading();
            Store.userData && await getAllStaticData(Store.tokenData, false, false, false, true)
                .then(async (res) => {
                    if (res.status) {
                    } else {
                        Alert.alert("Ошибка", res.curError);
                    }
                })
                .catch(err => {
                    Alert.alert("ошибка", 'Ошибка: \n' + err);
                });
        } catch (error) {
            console.error('ошибка:', error);
        } finally {
            stopLoading();
        }
    };

    const handleBarCodeScanned = async ({ data }) => {
        try {
            setScanned(true);
            if(Store.userData.NAME){
                const res = await getDataAboutDocs(data); 
                if (res && res.result && Array.isArray(res.result.items) && res.result.items.length > 0) {
                    const item = res.result.items[0];
                    if (item.entityTypeId == "168" && ((Store.isWarehouse && (item.stageId == "DT168_9:NEW" || item.stageId == "DT168_9:UC_NOOWSD" || item.stageId == "DT168_9:UC_9ARBA5")) || (item.ufCrm5Driver == Store.userData.ID && (item.stageId == "DT168_9:UC_A3G3QR" || item.stageId == "DT168_9:UC_YAHBD0")))) {
                        setDocNumber(1);
                    } else if (item.entityTypeId == "133" && item.stageId != "DT133_10:SUCCESS" && item.stageId != "DT133_10:FAIL") {
                        setDocNumber(2);
                    } else if (item.entityTypeId == "166" && item.stageId == "DT166_16:UC_NU0MRZ") {
                        setDocNumber(3);
                    } else {
                        showPopup('Неверный тип или этап документа', 'warning');
                        setTimeout(() => {
                            setScanned(false);
                        }, 500);
                        return;
                    }
                    setModalVisibleState(true);
                    Store.setUpdData(item);
                    await setModalText(item);
                } else {
                    console.error(':', res);
                    showPopup('Документ не найден', 'warning');
                    setTimeout(() => {
                        setScanned(false);
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    setScanned(false);
                }, 500);
                Linking.openURL(data).catch(() => {
                    showPopup(`Содержимое кода не ссылка: ${data}`, 'warning')          
                }); 
                
            }
            let dataToSave = {
                id: Store.userData.NAME ? Store.userData.ID : Store.userData.user.id,
                data: data
            };            
            Store.addUserCode(dataToSave)
            console.log(Store.userCodes)
        } catch (error) {
            console.error("Ошибка при сканировании штрихкода:", error);
            // showPopup(`Ошибка: ${error.message}`, 'warning');
            setTimeout(() => {
                setScanned(false);
            }, 500);
        }
    };

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <View style={styles.overlay}>
                    <CameraView style={styles.camera} facing={'back'} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} mute>
                        <LottieView
                            source={anim2}
                            style={{ width: "100%", height: "100%" }}
                            autoPlay
                            loop
                        />
                    </CameraView>
                    <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState} docData={modalText} docNumber={docNumber} />
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
});

export default Reader;
