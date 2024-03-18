import React from "react";
import {Modal, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import authStore from "../stores/authStore";
import { storeAuthStatus } from '../secStore';
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import depStore from "../stores/depStore";
import QRDialog from "./QRDialog";
let userData = '';
type  logOutProp = NativeStackNavigationProp<RootStackParamList, 'MainPage'>;
const UserDataDialog = ({ visible, onClose }) => {
const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleLogout = async () => {
        onClose(); // Закрываем модальное окно после выхода
        await  storeAuthStatus('');
        authStore.setUserData('');
        navigation.replace('Authorize');

    };

    React.useEffect(() => {
        const secName = authStore.userData[0].SECOND_NAME === undefined ? ' ' : authStore.userData[0].SECOND_NAME;
        userData = `${authStore.userData[0].LAST_NAME} ${authStore.userData[0].NAME} ${secName}\n${authStore.userData[0].WORK_POSITION}`;
    }, [authStore.userData[0]]);

    React.useEffect(() => {
        const secName = authStore.userData[0].SECOND_NAME === undefined ? ' ' : authStore.userData[0].SECOND_NAME;

        userData = userData.concat(`\n${depStore.depData[0].NAME}`);
    }, [depStore.depData[0]]);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };


    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.dialog}>
                    <TouchableOpacity   style={styles.opacities}  onPress={toggleModal}>
                        <Icon name="qrcode" size={40} color="#fff"/>
                    </TouchableOpacity>
                    <Text style={styles.text}>{userData}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity   style={styles.opacities} onPress={handleLogout}>
                            <Icon name="user-times" size={40} color="#fff"/>
                            <Text style={styles.text}>выход</Text>
                        </TouchableOpacity>
                        <TouchableOpacity   style={styles.opacities}  onPress={onClose}>
                            <Icons name="cancel" size={40} color="#fff" />
                            <Text style={styles.text}>отмена</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <QRDialog visible={modalVisible} onClose={toggleModal}/>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#444',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderColor:'#777',
        borderWidth:2,
    },
    text: {
        marginVertical: 10,
        fontSize: 16,
        textAlign: "center",
        color:'#fff'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 60
    },
    opacities:{
        alignItems: "center",
        marginTop:30,
    },
});

export default UserDataDialog;
