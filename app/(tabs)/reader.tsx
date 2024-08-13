import React, { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import ChooseStateDialog from "src/modals/chooseStateDialog";
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";
import LottieView from 'lottie-react-native';
import anim2 from 'src/anim2.json';
import { getAllStaticData } from "src/requests/userData";
import { getDataAboutDocs } from "src/requests/docs";
import { usePopupContext } from "src/hooks/popup/PopupContext";
import useNetworkStatus from "src/hooks/networkStatus/useNetworkStatus";
import { addToArray, findObjectById } from "src/stores/asyncStorage";
import CustomModal from "src/components/custom-modal";

const Reader = () => {
    const [scanned, setScanned] = useState(false);
    const [modalVisibleState, setModalVisibleState] = useState(false);
    const [modalVisibleAD, setModalVisibleAD] = useState(false);
    const [modalText, setModalText] = useState('');
    const [docNumber, setDocNumber] = useState(0);
    const { loading, startLoading, stopLoading } = useLoading();
    const [permission, requestPermission] = useCameraPermissions();
    const { showPopup } = usePopupContext();
    const [doc, setDoc] = useState(null);
    const [docId, setDocId] = useState('');
    const isConnected = useNetworkStatus();

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
            await getAllStaticData(Store.tokenData, false, false, false, true,isConnected)
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

    const addObjInStory = async(id) =>{
        let date = new Date();
        console.log(`${id}_${date}`);
        addToArray({id_time: `${id}_${date}`});
    }

    const handleBarCodeScanned = async ({ data }) => {
        try {
            setScanned(true);
            if(data.includes('$')){
                let obj = findObjectById(data)
                setDoc(obj)
                setDocId(data)
                if(obj==null)
                {
                    addObjInStory(data);
                    return;
                }
                else{
                    setModalVisibleState(true);
                    setModalText(JSON.stringify(obj));
                    return;
                }
            }else{
                showPopup('неизвестный тип документа', 'error');
                    return;
            }
            const res = await getDataAboutDocs(data); 
            if (res && res.result && Array.isArray(res.result.items) && res.result.items.length > 0) {
                const item = res.result.items[0];
                if (item.entityTypeId == "168" && ((Store.isWarehouse && (item.stageId == "DT168_9:NEW" || item.stageId == "DT168_9:UC_NOOWSD" || item.stageId == "DT168_9:UC_9ARBA5")) || (item.ufCrm5Driver == Store.userData.ID && (item.stageId == "DT168_9:UC_A3G3QR" || item.stageId == "DT168_9:UC_YAHBD0")))) {
                    setDocNumber(1);
                } else if (item.entityTypeId == "133" && item.stageId != "DT133_10:SUCCESS" && item.stageId != "DT133_10:FAIL" ) {
                    if(item.ufCrm6AllUpdAssembled!="N")
                    {
                        showPopup('Не все УПД собраны,\nдокумент не может быть отправлен', 'warning');
                    return;
                    }
                    setDocNumber(2);
                } else if (item.entityTypeId == "166" && item.stageId == "DT166_16:UC_NU0MRZ") {
                    setDocNumber(3);
                } else {
                    showPopup('Неверный тип или этап документа', 'warning');
                }
                setModalVisibleState(true);
                Store.setUpdData(item);
                setModalText(item);
            } else {
                console.error(':', res);
                showPopup('Документ не найден', 'warning');
            }
        } catch (error) {
            console.error("Ошибка при сканировании кода:", error);
            showPopup(`Ошибка сканирования: ${error.message}`, 'error');
            
        } finally{
            setTimeout(() => {
                setScanned(false);
            }, 500);
        }
    };

    const toggleModalState = () => {
        setModalVisibleState(!modalVisibleState);
        setScanned(false);
    };

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
                    <CameraView style={styles.camera} facing={'back'} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} mute>
                        <LottieView
                            source={anim2}
                            style={{ width: "100%", height: "100%" }}
                            autoPlay
                            loop
                        />
                    </CameraView>
                    <ChooseStateDialog visible={modalVisibleState} onClose={toggleModalState} docData={modalText} docNumber={docNumber} />
                    <CustomModal
                visible={modalVisibleAD}
                onClose={toggleModalAD}
                marginTOP={0.2} 
                title={doc.title? doc.title: docId} 
                content={
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{flex:1, width:'40%'}} onPress={()=>{                                   
                                        addObjInStory(docId);
                        }}>
                            <View style={{ backgroundColor: '#d2ff41', margin: '10%', padding: 10, alignContent: "center", alignItems: "center", borderRadius: 20 }}>                               
                                <Text style={styles.Title}>ОК</Text>
                            </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1, width:'40%'}} onPress={toggleModalAD}>
                                <View style={{ backgroundColor: '#db6464', margin: '10%', padding: 10, alignContent: "center", alignItems: "center", borderRadius: 20 }}>                                
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
      Text: {
        fontSize: 16,
        color: projColors.currentVerse.fontAccent,
      },
});

export default Reader;
