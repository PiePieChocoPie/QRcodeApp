import React, {useState} from "react";
import {Modal, View, StyleSheet, Text, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {RadioButton} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import {getAuthStatus} from "../secStore";
import {sendTo1cData} from "../http";
const ChooseStateDialog = ({visible, onClose, guidDoc}) => {
    const [checked, setChecked] = useState({label:'', value:''});

    const acceptAxios = async () => {
        console.log(checked)
        if (checked.label!="") {
            const token = await getAuthStatus();
            let stat = checked.label;
            console.log(`stat ${stat}, \n checked ${checked}`)
            await sendTo1cData(guidDoc, stat).then((res) => {
                console.log(res);
            })
                .catch((err) => {
                    console.log(err);
                })
            Alert.alert('успешно',`Отправлен документ - \n${guidDoc}\n\nCо статусом - \n${stat}`);
        }
        else{
            Alert.alert('ошибка',"Выберите статус!")
        }
    };
    const RadioButtonOptions = ([
        { label: "1.На выдаче", value: "first" },
        { label: "2.Предпроверка", value: "second" },
        { label: "3.Сдан", value: "third" },
        { label: "4.Не сдан", value: "fourth" },
        { label: "5.На исправлении", value: "fifth" },
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
            <View style={styles.RBView}>
                {RadioButtonOptions.map((option) => (
                    <RadioButton.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        status={checked === option ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(option)}
                        labelStyle={{color: checked.value === option.value ? '#fff' : '#aaa',
                            fontWeight:checked.value === option.value ? 'bold' : '300',
                            width: Dimensions.get("window").width-190,
                            alignItems: 'center',
                            justifyContent: "center",
                            textAlign: "center"}}
                        uncheckedColor={"#eee"}
                        color={'#ddd'}
                    />
                ))}
            </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.container} onPress={acceptAxios}>
                        <Icon name="check"  size={50} color="#FFF"/>
                        <Text style={styles.text}>отправить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.container}>
                    <Icon name="close"  size={50} color="#FFF"/>
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
        backgroundColor: '#444',
        padding: 20,
        borderRadius: 10,
        borderColor:'#777',
        borderWidth:2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginVertical: 10,
        fontSize: 16,
        textAlign: "center",
        color:'#fff',
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
