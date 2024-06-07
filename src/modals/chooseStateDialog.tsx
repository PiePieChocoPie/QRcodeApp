import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import useLoading from "src/useLoading";
import CustomModal from "src/components/custom-modal";
import Toast from 'react-native-root-toast';
import { updAttorneyStatus, updItineraryStatus, updUpdStatus } from "src/requests/docs";

const ChooseStateDialog = ({ visible, onClose, docData, docNumber }) => {
    const [checked, setChecked] = useState({ label: '', value: '' });
    const [updStatuses] = useState(Store.updStatusesData);
    const [itineraryStatuses] = useState(Store.itineraryStatusesData);
    const [attorneyStatuses] = useState(Store.attorneyStatusesData);
    const { loading, startLoading, stopLoading } = useLoading();

    const getNextStatus = () => {
        if (!docData) {
            console.log("docData is undefined");
            return { error: 'Изменение статуса документа невозможно' };
        }
        if (!docData.stageId) {
            console.log("docData.stageId is undefined", docData);
            return { error: 'Изменение статуса документа невозможно' };
        }

        const curStatus = docData.stageId;
        const newSt = { error: 'Изменение статуса документа невозможно' };
        console.log("docNumber:", docNumber);
        console.log("curStatus:", curStatus);
        console.log("updStatuses:", updStatuses);
        console.log("itineraryStatuses:", itineraryStatuses);

        if (docNumber == 1) {
            for (let i = 0; i < updStatuses.length; i++) {
                if (updStatuses[i].STATUS_ID == curStatus && i != updStatuses.length - 2) {
                    console.log(i, docData.ufCrm5Driver)
                    return updStatuses[i + 1];
                }
            }
        } else if (docNumber == 2) {
            for (let i = 0; i < itineraryStatuses.length; i++) {
                if (itineraryStatuses[i].STATUS_ID == curStatus && i != itineraryStatuses.length - 2) {
                    return itineraryStatuses[i + 1];
                }
            }
        } else if (docNumber == 3) {
            for (let i = 0; i < attorneyStatuses.length; i++) {
                if (attorneyStatuses[i].STATUS_ID == curStatus && i != attorneyStatuses.length - 2) {
                    return attorneyStatuses[i + 1];
                }
            }
        }

        console.log(newSt.error);
        return newSt;
    }

    const itineraryHandling = async () => {
        try {
            let setableStatus;
            let alertMes = '';
            if ((docData.stageId === itineraryStatuses[0].STATUS_ID || docData.stageId === itineraryStatuses[1].STATUS_ID) && Store.userData.ID === docData.ufCrm6Driver) {
                setableStatus = getNextStatus();
                if (setableStatus.error) {
                    alertMes = setableStatus.error;
                } else {
                    await updItineraryStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID);
                    alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`;
                }
            } else {
                alertMes = "На данном этапе взаимодействие с документом невозможно";
            }
            let toast = Toast.show(alertMes, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
            });
            setTimeout(() => { Toast.hide(toast); }, 15000);
        } catch (e) {
            alert(e);
        }
    }

    const updHandling = async () => {
        let setableStatus;
        let alertMes = '';
        if (docData.stageId == updStatuses[0].STATUS_ID || docData.stageId == updStatuses[1].STATUS_ID) {
            setableStatus = getNextStatus();
            if (setableStatus.error) {
                alertMes = setableStatus.error;
            } else {
                await updUpdStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID);
                alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`;
            }
        } else if ((docData.stageId == updStatuses[3].STATUS_ID || docData.stageId == updStatuses[4].STATUS_ID) && Store.userData.ID == docData.ufCrm5Driver) {
                setableStatus = getNextStatus();
                if (setableStatus.error) {
                    alertMes = setableStatus.error;
                } else {
                    await updUpdStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID);
                    alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`;
                }
            } else {
            alertMes = "На данном этапе взаимодействие с документом невозможно";
        }
        let toast = Toast.show(alertMes, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
        });
        setTimeout(() => { Toast.hide(toast); }, 15000);
    }

    const acceptAxios = async () => {
        try {
            if (docData.entityTypeId == "168") {
                await updHandling();
            } else if (docData.entityTypeId == "133") {
                await itineraryHandling(); 
            } else if (docData.entityTypeId == "166") {
                await attorneyHandling();
            } else {
                alert("Неверный формат обрабатываемого документа");
            }
        } catch (e) {
            alert(e);
        }
        onClose();
    };
    const attorneyHandling = async () => {
        let setableStatus;
        let alertMes = '';
        if (docData.stageId != attorneyStatuses[4].STATUS_ID || docData.stageId != attorneyStatuses[5].STATUS_ID) {
            setableStatus = getNextStatus();
            if (setableStatus.error) {
                alertMes = setableStatus.error;
            } else {
                await updAttorneyStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID);
                alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`;
            }
        } else {
            alertMes = "На данном этапе взаимодействие с документом невозможно";
        }
        let toast = Toast.show(alertMes, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
        });
        setTimeout(() => { Toast.hide(toast); }, 15000);
    }

    const nextStatus = getNextStatus();
    const isDisabled = !!nextStatus.error; // Преобразование в булевое значение

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            content={loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <View style={styles.containerCentrallityFromUpper}>
                    <Text style={[styles.Text, { textAlign: "center" }]}>Обновление статуса документа</Text>
                    <Text style={[styles.Title, { textAlign: "center" }]}>{docData.title}</Text>
                    {isDisabled ? (
                        <Text style={[styles.Title, { color: '#DE283B', textAlign: "center" }]}>недоступно</Text>
                    ) : (
                        <View>
                            <Text style={[styles.Text, { textAlign: "center" }]}>Установить статус -</Text>
                            <Text style={[styles.Title, { textAlign: "center" }]}>{nextStatus.NAME}</Text>
                        </View>
                    )}
                    <View style={styles.RBView}></View>
                    <View style={styles.containerCentrallityFromUpper}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ backgroundColor: '#d2ff41', margin: '10%', padding: 10, width: '40%', alignContent: "center", alignItems: "center", borderRadius: 20 }}>
                                <TouchableOpacity onPress={acceptAxios} disabled={isDisabled}>
                                    <Text style={styles.Title}>ОК</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: '#db6464', margin: '10%', padding: 10, width: '40%', alignContent: "center", alignItems: "center", borderRadius: 20 }}>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.Title}>Отмена</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )} marginTOP={undefined}        />
    );
};

export default ChooseStateDialog;
