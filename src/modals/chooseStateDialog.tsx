import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert, StyleSheet } from 'react-native';
import { projColors } from "src/stores/styles";
import Store from "src/stores/mobx";
import useLoading from "src/useLoading";
import CustomModal from "src/components/custom-modal";
import { getUpdRejectStatuses, updAttorneyStatus, updItineraryStatus, updUpdStatus } from "src/requests/docs";
import { Dropdown } from "react-native-element-dropdown";
import { usePopupContext } from "src/PopupContext";

const ChooseStateDialog = ({ visible, onClose, docData, docNumber }) => {
    const [updStatuses] = useState(Store.updStatusesData);
    const [itineraryStatuses] = useState(Store.itineraryStatusesData);
    const [attorneyStatuses] = useState(Store.attorneyStatusesData);
    const { loading, startLoading, stopLoading } = useLoading();
    const [comment, setComment] = useState(null);
    const [isRejected, setRejected] = useState(false);
    const [rejectStatus, setRejectStatus] = useState(null);
    const [rejectStatuses, setRejectStatuses] = useState([]);
    const { showPopup } = usePopupContext();

    useEffect(() => {
        const fetchRejectStatuses = async () => {
            const statuses = await getUpdRejectStatuses();
            setRejectStatuses(statuses);
            setRejectStatus("Принято без нареканий")
        };
        fetchRejectStatuses();
    }, []);

    const getNextStatus = () => {
        if (!docData) {
            return { error: 'Изменение статуса документа невозможно' };
        }
        if (!docData.stageId) {
            console.log("docData.stageId is undefined", docData);
            return { error: 'Изменение статуса документа невозможно' };
        }

        const curStatus = docData.stageId;
        const newSt = { error: 'Изменение статуса документа невозможно' };

        if (docNumber === 1) {
            for (let i = 0; i < updStatuses.length; i++) {
                if (updStatuses[i].STATUS_ID === curStatus && i !== updStatuses.length - 2) {
                    return updStatuses[i + 1];
                }
            }
        } else if (docNumber === 2 && (docData.ufCrm6Driver === Store.userData.ID || Store.isWarehouse && curStatus === "DT133_10:PREPARATION")) {
            for (let i = 0; i < itineraryStatuses.length; i++) {
                if (itineraryStatuses[i].STATUS_ID === curStatus) {
                    return itineraryStatuses[i + 1];
                }
            }
        } else if (docNumber === 3) {
            let i = attorneyStatuses.length;
            return attorneyStatuses[i - 2];
        }

        return newSt;
    };

    const handleStatusUpdate = async (updateFunc) => {
        try {
            startLoading();
            let assignableStatus = getNextStatus();
            let messageType = "ufCrm5AcceptComment";
            let alertMes = ':(\nдокумент не был отправлен';
            if (docNumber === 1 && isRejected) {
                assignableStatus = updStatuses[updStatuses.length - 1];
                messageType = "ufCrm5RejectionComment";
            }

            if (assignableStatus.error) {
                alertMes = assignableStatus.error;
                showPopup(alertMes, "error");
            } else {
                await updateFunc(docData.id, assignableStatus.STATUS_ID, Store.userData.ID, rejectStatus, messageType, comment);
                alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${assignableStatus.NAME}:)`;
                showPopup(alertMes, "success");
            }
        } catch (e) {
            showPopup(`непредвиденная ошибка:\n${e}`, "error");
        } finally {
            stopLoading();
            onClose();
        }
    };

    const itineraryHandling = () => handleStatusUpdate(updItineraryStatus);
    const updHandling = () => handleStatusUpdate(updUpdStatus);
    const attorneyHandling = () => handleStatusUpdate(updAttorneyStatus);

    const acceptAxios = async () => {
        try {
            startLoading();
            if (docData.entityTypeId === "168") {
                await updHandling();
            } else if (docData.entityTypeId === "133") {
                await itineraryHandling();
            } else if (docData.entityTypeId === "166") {
                await attorneyHandling();
            }
        } catch (e) {
            showPopup(`непредвиденная ошибка:\n${e}`, "error");
        } finally {
            stopLoading();
            onClose();
        }
    };

    const commentHandler = (value) => {
        setComment(value);
    };

    const nextStatus = getNextStatus();

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            title={docData.title}
            content={loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <Text style={styles.infoText}>Обновление статуса документа</Text>
                    <View>
                        <Text style={styles.infoText}>Установить статус -</Text>
                        <Text style={styles.statusText}>{isRejected ? updStatuses[updStatuses.length - 1].NAME : nextStatus.NAME}</Text>
                    </View>
                    <View style={styles.dropdownContainer}>
                        {docData.stageId === "DT168_9:UC_YAHBD0" && (
                            <>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={rejectStatuses}
                                    labelField="VALUE"
                                    valueField="ID"
                                    placeholder="Выберите статус"
                                    value={rejectStatus?.ID}
                                    onChange={async (item) => {
                                        await setRejectStatus(item);
                                        item.VALUE === "Принято без нареканий" ? setRejected(false) : setRejected(true);
                                        if (item.VALUE === "Другое") {
                                            setComment('');
                                        } else {
                                            setComment(item.VALUE);
                                        }
                                    }}
                                />
                                {rejectStatus?.VALUE === "Другое" && (
                                    <TextInput
                                        style={styles.input}
                                        value={comment}
                                        placeholder='Комментарий'
                                        onChangeText={commentHandler}
                                        keyboardType={"ascii-capable"}
                                        maxLength={50}
                                    />
                                )}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.okButton} onPress={() => {
                                        if (docData.stageId === "DT168_9:UC_YAHBD0") {
                                            if (rejectStatus.VALUE === "Другое" && comment === "") {
                                                Alert.alert("Укажите причину отклонения документа");
                                                return;
                                            }
                                        }
                                        acceptAxios();
                                    }}>
                                        <Text style={styles.buttonText}>ОК</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                        <Text style={styles.buttonText}>Отмена</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            )}
            marginTOP={0.2}
        />
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    infoText: {
        fontSize: 16,
        color: projColors.currentVerse.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: projColors.currentVerse.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    dropdownContainer: {
        width: '100%',
    },
    dropdown: {
        height: 50,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    okButton: {
        flex: 1,
        backgroundColor: '#d2ff41',
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#db6464',
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChooseStateDialog;
