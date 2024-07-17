import React, { useState, useEffect } from "react";
import {Modal, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert} from 'react-native';
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import useLoading from "src/useLoading";
import CustomModal from "src/components/custom-modal";
import Toast from 'react-native-root-toast';
import { getUpdRejectStatuses, updAttorneyStatus, updItineraryStatus, updUpdStatus } from "src/requests/docs";
import { Dropdown } from "react-native-element-dropdown";

const ChooseStateDialog = ({ visible, onClose, docData, docNumber }) => {
    const [updStatuses] = useState(Store.updStatusesData);
    const [itineraryStatuses] = useState(Store.itineraryStatusesData);
    const [attorneyStatuses] = useState(Store.attorneyStatusesData);
    const { loading, startLoading, stopLoading } = useLoading();
    const [comment, setComment] = useState(null);
    const [isRejected, setRejected] = useState(false);
    const [rejectStatus, setRejectStatus] = useState(null);
    const [rejectStatuses, setRejectStatuses] = useState([]);

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
        } else if (docNumber === 2&&(docData.ufCrm6Driver==Store.userData.ID||Store.isWarehouse&&curStatus=="DT133_10:PREPARATION")) {
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

    const handleStatusUpdate = async (updateFunc:any) => {
        try {
            startLoading();
            let assignableStatus: any = getNextStatus();
            let messageType:string ="ufCrm5AcceptComment";
            let alertMes = 'документ не был отправлен';
            let docBackgroundColor = '#db6464';
            let textColors = "#ccc"
            if(docNumber==1&&isRejected){
                assignableStatus = updStatuses[updStatuses.length - 1];
                messageType = "ufCrm5RejectionComment";
            }
            
            console.log(assignableStatus, getNextStatus())
            if (assignableStatus.error) {
                alertMes = assignableStatus.error;
            } else {
                await updateFunc(docData.id, assignableStatus.STATUS_ID, Store.userData.ID, rejectStatus, messageType, comment);
                alertMes = `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${assignableStatus.NAME}`;
                docBackgroundColor = '#d2ff41';
                textColors="#DE283B"
            }

            let toast = Toast.show(alertMes, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                backgroundColor: docBackgroundColor,
                shadow:false,
                textColor:textColors
            });
            setTimeout(() => { Toast.hide(toast); }, 15000);
        } catch (e) {
            alert(e);
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
            console.log("ryjgrf")
            startLoading();
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
        } finally {
            stopLoading();
            onClose();
        }
    };

    const commentHandler = (value) => {
        setComment(value);
    };

    const nextStatus = getNextStatus();
    // const isDisabled = nextStatus.error; // Преобразование в булевое значение

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            title={docData.title}
            content={loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <View style={styles.containerCentrallityFromUpper}>
                    <Text style={[styles.Text, { textAlign: "center" }]}>Обновление статуса документа</Text>
                    {/* {isDisabled ? (
                        <Text style={[styles.Title, { color: '#DE283B', textAlign: "center" }]}>недоступно</Text>
                    ) : ( */}
                        <View>
                            <Text style={[styles.Text, { textAlign: "center" }]}>Установить статус -</Text>
                            <Text style={[styles.Title, { textAlign: "center" }]}>{isRejected?updStatuses[updStatuses.length - 1].NAME:nextStatus.NAME}</Text>
                        </View>
                    {/* )} */}
                    <View style={styles.RBView}>
                        {docData.stageId === "DT168_9:UC_YAHBD0" && (
                            <>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={rejectStatuses}
                                    
                                    labelField="VALUE"
                                    valueField="ID"
                                    placeholder="Выберите статус"
                                    value={rejectStatus.ID}
                                    onChange={async(item) => {
                                        await setRejectStatus(item);
                                        console.log(rejectStatus.VALUE)
                                        item.VALUE=="Принято без нареканий"?setRejected(false):setRejected(true);
                                        if (item.VALUE == "Другое") {
                                            setComment('');
                                        } else {
                                            setComment(item.VALUE);
                                        }
                                    }}
                                />
                               
                            </>
                        )}
                          {
                                rejectStatus&&rejectStatus.VALUE=="Другое"&&
                                    (<TextInput
                                        style={styles.input}
                                        value={comment}
                                        placeholder='Комментарий'
                                        onChangeText={commentHandler}
                                        keyboardType={"ascii-capable"}
                                        maxLength={50}
                                    />)
                                    }
                        <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{flex:1, width:'40%'}} onPress={()=>{
                                    console.log(`docData.stageId == "DT168_9:UC_YAHBD0" = ${docData.stageId == "DT168_9:UC_YAHBD0"}`)
                                    if(docData.stageId == "DT168_9:UC_YAHBD0")
                                        {
                                            if(rejectStatus.VALUE=="Другое"&&comment=="")
                                            {
                                            alert("Укажите причину отклонения документа");
                                            return
                                            }
                                        }
                                        acceptAxios();
                                    }
                                }
                                    //  disabled={isDisabled}
                                    >
                            <View style={{ backgroundColor: '#d2ff41', margin: '10%', padding: 10, alignContent: "center", alignItems: "center", borderRadius: 20 }}>                               
                                <Text style={styles.Title}>ОК</Text>
                            </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1, width:'40%'}} onPress={onClose}>
                                <View style={{ backgroundColor: '#db6464', margin: '10%', padding: 10, alignContent: "center", alignItems: "center", borderRadius: 20 }}>                                
                                    <Text style={styles.Title}>Отмена</Text>                                
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            marginTOP={0.2}
        />
    );
};

export default ChooseStateDialog;
