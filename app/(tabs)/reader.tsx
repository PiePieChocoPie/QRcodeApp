import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";
import Toast from 'react-native-root-toast';
import LottieView from 'lottie-react-native';
import anim2 from 'src/anim2.json';
import { getAllStaticData } from "src/requests/userData";
import { getDataAboutDocs } from "src/requests/docs";

const Reader = () => {
    const [scanned, setScanned] = useState<boolean>(false);
    const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const { loading, startLoading, stopLoading } = useLoading();
    const [permission, requestPermission] = useCameraPermissions();
    
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

    const fetchData = async () => {
        try {
            startLoading();
            await getAllStaticData(Store.tokenData, false, false, false, true)
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
                    return Alert.alert("Неверный тип или этап документа", "Невозможно обработать документ", [{
                        onPress: ()=> setScanned(false), 
                    }])
                    
                }
                setModalVisibleState(true);
                Store.setUpdData(item);
                await setModalText(item);
            } else {
                console.error('No items found or invalid response structure:', res);
                let toast = Toast.show(`Ошибка: документ не найден`, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.TOP
                });
                setTimeout(function hideToast() {
                    Toast.hide(toast);
                }, 15000);
            }

        } catch (error) {
            console.error("Ошибка при сканировании штрихкода:", error);
            let toast = Toast.show(`Ошибка: ${error.message}`, {
                position: Toast.positions.TOP,
                duration: Toast.durations.LONG,
            });
            setTimeout(function hideToast() {
                Toast.hide(toast);
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

export default Reader;