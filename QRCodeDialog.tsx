import React from "react";
import {Modal, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import authStore from "./authStoreDir";
import { storeAuthStatus } from './store';
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "./types/navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
let userData = '';
type  logOutProp = NativeStackNavigationProp<RootStackParamList, 'QRPage'>;
const QRCodeDialog = ({ visible, onClose }) => {
const navigation = useNavigation<NativeStackNavigationProp<any>>()
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

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.dialog}>
                    <Text style={styles.text}>{userData}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity   style={styles.opacities}  onPress={handleLogout}>
                            <Icon name="user-times" size={40} color="#fff"/>
                            <Text style={styles.text}>выход</Text>
                        </TouchableOpacity>
                        <TouchableOpacity   style={styles.opacities}  onPress={onClose}>
                            <Icons name="cancel" size={40} color="#fff" />
                            <Text style={styles.text}>отмена</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        marginTop: 20,
        gap: 60
    },
    opacities:{
        alignItems: "center",
        marginTop:30,
    },
});

export default QRCodeDialog;
