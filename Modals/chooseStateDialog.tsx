import React, {useState} from "react";
import {Modal, View, StyleSheet, Text, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {RadioButton} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import {getAuthStatus} from "../secStore";
import projColors from "../stores/staticColors";
import updStore from "../stores/updStore";
import authStore from "../stores/authStore";
import statusesListStore from "../stores/statusesListStore";
import {updItineraryStatus, updUpdStatus} from "../http";
import {Camera} from "expo-camera";
const ChooseStateDialog = ({visible, onClose, docData}) => {
    const [checked, setChecked] = useState({label:'', value:''});
    const [updStatuses] = React.useState(statusesListStore.statusData);
    const [itineraryStatuses] = React.useState(statusesListStore.itineraryData);
    React.useEffect(() => {
        setChecked(RadioButtonOptions[0])

    }, [statusesListStore.statusData]);
    React.useEffect(() => {
        setChecked(RadioButtonOptions[0])

    }, [statusesListStore.itineraryData]);

    const getNextStatus = () =>{
        const curStatus = docData.stageId;
        const newSt='Изменение статуса документа невозможно';
        console.log(updStatuses.length, docData.entityTypeId, curStatus)

        if (docData.entityTypeId=="168"){
            for(let i=0;i<updStatuses.length;i++){
                console.log(statusesListStore.statusData[i].STATUS_ID ==curStatus, i!=updStatuses.length-2, updStatuses[i+1])
                if(statusesListStore.statusData[i].STATUS_ID ==curStatus&&i!=updStatuses.length-2)
                console.log(123);
                return updStatuses[i+1];
            }
        }
        else if(docData.entityTypeId=="133")
        for(let i=0;i<itineraryStatuses.length;i++){
            if(statusesListStore.itineraryData[i].STATUS_ID ==curStatus&&i!=itineraryStatuses.length-2)
                return itineraryStatuses[i+1];

        }
        return newSt;
    }

    const itineraryHandling = async() =>{
        try {
            let setableStatus;
            console.log(docData.stageId, updStatuses[3].STATUS_ID, updStatuses[4].STATUS_ID)
            if (docData.stageId !== updStatuses[4].STATUS_ID && docData.stageId !== updStatuses[3].STATUS_ID && authStore.userData[0].ID === docData.ufCrm6Driver) {

                if (checked.value === 'break') {
                    setableStatus = updStatuses[4];
                } else if (checked.label === 'newStatus') {
                    setableStatus = getNextStatus();

                } else {
                    return Alert.alert('ошибка', "Неожиданная ошибка!");
                }
                await updItineraryStatus(docData.id, setableStatus.STATUS_ID, authStore.userData[0].ID)
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
        console.log(docData.stageId, updStatuses[5].STATUS_ID, updStatuses[6].STATUS_ID)
        if (docData.stageId === updStatuses[0].STATUS_ID) {

            if (checked.value === 'break') {
                setableStatus = updStatuses[6];
            }
            else if(checked.label === 'newStatus'){
                setableStatus = getNextStatus();

            } else {
                return Alert.alert('ошибка', "Неожиданная ошибка!");
            }
            await updUpdStatus(docData.id, setableStatus.STATUS_ID, authStore.userData[0].ID)
                .then()
            Alert.alert('успешно', `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`);
        }
        else Alert.alert("Нет доступа", "На данном этапе взаимодействие с документом невозможно");
    }
    const acceptAxios = async () => {
        // меняем статус документа
    try {
        if(docData.entityTypeId ==="168") await updHandling();
        else if(docData.entityTypeId === "133") await itineraryHandling();
        else alert("Неверный формат обрабатываемого документа")
        // console.log(checked)
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
            style={{flex:1}}
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
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
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
    },
    dialog: {
        backgroundColor: projColors.currentVerse.second,
        padding: 20,
        borderRadius: 10,
        borderColor:projColors.currentVerse.main,
        borderWidth:2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginVertical: 10,
        fontSize: 16,
        textAlign: "center",
        color:projColors.currentVerse.fontAccent,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 40,
    },
    RBView:{
        alignItems:"center",
        justifyContent:"center",
    },
});

export default ChooseStateDialog;
