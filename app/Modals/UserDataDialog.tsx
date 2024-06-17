import React from "react";
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import { storeAuthStatus } from '../../secStore';
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import QRDialog from "./QRDialog";
import { router } from "expo-router";
import Store from "../stores/mobx";
import { projColors, styles } from "../styles";
let userData = '';
const UserDataDialog = ({ visible, onClose }) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleLogout = async () => {
        onClose(); // Закрываем модальное окно после выхода
        await  storeAuthStatus('');
        Store.setUserData('');
        router.back();

    };

    React.useEffect(() => {
        const secName = Store.userData.SECOND_NAME === undefined ? ' ' : Store.userData.SECOND_NAME;
        userData = `${Store.userData.LAST_NAME} ${Store.userData.NAME} ${secName}\n${Store.userData.WORK_POSITION}`;
    }, [Store.userData]);

    React.useEffect(() => {
        const secName = Store.userData.SECOND_NAME === undefined ? ' ' : Store.userData.SECOND_NAME;

        userData = userData.concat(`\n${Store.depData.NAME}`);
    }, [Store.depData[0]]);

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
                        <Icon name="qrcode" size={40} color={projColors.currentVerse.font}/>
                    </TouchableOpacity>
                    <Text style={styles.text}>{userData}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity   style={styles.opacities} onPress={handleLogout}>
                            <Icon name="user-times" size={40} color={projColors.currentVerse.font}/>
                            <Text style={styles.text}>выход</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity   style={styles.opacities}  onPress={projColors.switchVerse}>*/}
                        {/*    {projColors.currentVerse ===projColors.lightVerse ?*/}
                        {/*        (*/}
                        {/*            <IconFeather name="moon" size={40} color={projColors.currentVerse.font} />*/}
                        {/*        )*/}
                        {/*        :*/}
                        {/*        (*/}
                        {/*            <IconFeather name="sun" size={40} color={projColors.currentVerse.font} />*/}
                        {/*        )*/}
                        {/*    }*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity   style={styles.opacities}  onPress={onClose}>
                            <Icons name="cancel" size={40} color={projColors.currentVerse.font} />
                            <Text style={styles.text}>отмена</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <QRDialog visible={modalVisible} onClose={toggleModal}/>
            </View>
        </Modal>
    );
};

export default UserDataDialog;
