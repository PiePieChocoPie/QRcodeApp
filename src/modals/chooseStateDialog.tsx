import React, {useState} from "react";
import {Modal, View,  Text, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {ActivityIndicator, RadioButton} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
import { getAllStaticData, updItineraryStatus, updUpdStatus } from "src/http";
import { useFocusEffect } from "expo-router";
import useLoading from "src/useLoading";

const ChooseStateDialog = ({visible, onClose, docData, docNumber}) => {
    const [checked, setChecked] = useState({label:'', value:''});
    const [updStatuses] = React.useState(Store.updStatusesData);
    const [itineraryStatuses] = React.useState(Store.itineraryStatusesData);
    const {loading, startLoading, stopLoading} = useLoading()

    useFocusEffect(
        
        React.useCallback(() => {
       
            setChecked(RadioButtonOptions[0])
                   
        }, []) 
    );

    const getNextStatus = () =>{
        console.log(updStatuses, itineraryStatuses)
        const curStatus = docData.stageId;
        const newSt='Изменение статуса документа невозможно';

        if (docNumber==1){
            for(let i=0;i<updStatuses.length;i++){
                if(updStatuses[i].STATUS_ID ==curStatus&&i!=updStatuses.length-2)
                //console.log(123);
                return updStatuses[i+1];
            }
        }
        else if(docNumber==2)
        for(let i=0;i<itineraryStatuses.length;i++){
            if(itineraryStatuses[i].STATUS_ID ==curStatus&&i!=itineraryStatuses.length-2)
                return itineraryStatuses[i+1];

        }
        return newSt;
    }

    const itineraryHandling = async() =>{
        try {
            let setableStatus;
            if (docData.stageId != updStatuses[4].STATUS_ID && docData.stageId != updStatuses[3].STATUS_ID && Store.userData[0].ID == docData.ufCrm6Driver) {
//console.log(123)
                if (checked.value === 'break') {
                    setableStatus = updStatuses[4];
                } else if (checked.value === 'newStatus') {
                    setableStatus = getNextStatus();

                } else {
                    return Alert.alert('ошибка', "Неожиданная ошибка!");
                }
                await updItineraryStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID)
                    .then()
                Alert.alert('успешно', `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`);
            } else Alert.alert("Нет доступа", "На данном этапе взаимодействие с документом невозможно");
        }
        catch (e){
            alert(e)
        }
    }

    const updHandling = async() =>{
        let setableStatus;
        //console.log(docData.stageId, updStatuses[5].STATUS_ID, updStatuses[6].STATUS_ID)
        if (docData.stageId === updStatuses[0].STATUS_ID) {

            if (checked.value == 'break') {
                setableStatus = updStatuses[6];
            }
            else if(checked.value == 'newStatus'){
                setableStatus = getNextStatus();

            } else {
                return Alert.alert('ошибка', "Неожиданная ошибка!");
            }
            await updUpdStatus(docData.id, setableStatus.STATUS_ID, Store.userData.ID)
                .then()
            Alert.alert('успешно', `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`);
        }
        else Alert.alert("Нет доступа", "На данном этапе взаимодействие с документом невозможно");
    }
    const acceptAxios = async () => {
        // меняем статус документа
    try {
        if(docData.entityTypeId =="168") await updHandling();
        else if(docData.entityTypeId == "133") await itineraryHandling();
        else alert("Неверный формат обрабатываемого документа")
        // //console.log(checked)
    } catch(e){
        alert(e)
    }
        onClose();
    };

    const RadioButtonOptions = ([
        // { label: "1.На выдаче", value: "first" },
        // { label: "2.Предпроверка", value: "second" },
        // { label: "3.Сдан", value: "third" },
        // { label: "4.Не сдан", value: "fourth" },
        // { label: "5.На исправлении", value: "fifth" },
        {label:getNextStatus().NAME, value:"newStatus"},
        {label:"прервать документ", value:"break"},
    ]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {loading ?(
            <View style={styles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
            </View> 
        ):
           
        (
            <View style={styles.container}>
            <View style={styles.dialog}>
                <Text style={styles.text}>обновление статуса документа {docData.title}</Text>
            <View style={styles.RBView}>
                {RadioButtonOptions.map((option) => (
                    <RadioButton.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        status={checked === option ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(option)}
                        labelStyle={{color: checked.value === option.value ? projColors.currentVerse.fontAccent : projColors.currentVerse.font,
                            fontWeight:checked.value === option.value ? 'bold' : '300',
                            width: Dimensions.get("window").width-190,
                            alignItems: 'center',
                            justifyContent: "center",
                            textAlign: "center"}}
                        uncheckedColor={projColors.currentVerse.font}
                        color={projColors.currentVerse.extra}

                    />
                ))}
            </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.container} onPress={acceptAxios}>
                        <Icon name="check"  size={50} color={projColors.currentVerse.fontAccent}/>
                        <Text style={styles.text}>отправить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.container}>
                    <Icon name="close"  size={50} color={projColors.currentVerse.fontAccent}/>
                    <Text style={styles.text}>отменить</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        )}
        </Modal>
    );
};
export default ChooseStateDialog;
