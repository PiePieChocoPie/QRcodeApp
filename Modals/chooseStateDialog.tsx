import React, {useState} from "react";
import {Modal, View, StyleSheet, Text, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {RadioButton} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import {getAuthStatus} from "../secStore";
import projColors from "../stores/staticColors";
import updStore from "../stores/updStore";
import authStore from "../stores/authStore";
import statusesListStore from "../stores/statusesListStore";
import {updUpdStatus} from "../http";
import {Camera} from "expo-camera";
const ChooseStateDialog = ({visible, onClose, docData}) => {
    const [checked, setChecked] = useState({label:'', value:''});
    const [statuses] = React.useState(statusesListStore.statusData);
    React.useEffect(() => {
        setChecked(RadioButtonOptions[0])

    }, [statusesListStore.statusData]);

    const getNextStatus = () =>{
        const curStatus = docData.stageId;
        const newSt='';
        for(let i=0;i<statuses.length;i++){
            if(statusesListStore.statusData[i].STATUS_ID ===curStatus&&i!==statuses.length-2)
                return statuses[i+1];

        }
        return newSt;
    }
    const acceptAxios = async () => {
    try {
        console.log(checked)
        let setableStatus;
        console.log(docData.stageId, statuses[4].STATUS_ID, statuses[3].STATUS_ID)
        if (docData.stageId !== statuses[4].STATUS_ID && docData.STATUS_ID !== statuses[3].STATUS_ID) {
            if (checked.value === 'break') {
                setableStatus = statuses[3];
            }
                else if(checked.label === 'newStatus'){
                setableStatus = getNextStatus();

                }
                    else if (docData.stageId===statuses[2].STATUS_ID) {
                setableStatus = statuses[4];

                    } else {
                        return Alert.alert('ошибка', "Выберите статус!");
                    }
                await updUpdStatus(docData.id, setableStatus.STATUS_ID, authStore.userData[0].ID)
                .then()
            Alert.alert('успешно', `Отправлен документ - \n${docData.title}\n\nCо статусом - \n${setableStatus.NAME}`);
        }
        else Alert.alert("Документ завершен", "Жизненный цикл документа был завершен")
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
