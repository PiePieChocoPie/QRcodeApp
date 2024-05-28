import React from 'react';
import {Modal, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { projColors, styles } from "src/stores/styles";
import QRCode from "react-native-qrcode-svg";

const ModalForm = ({ modalVisible, toggleModal, ID}) => {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.Title}>QR-код пользователя</Text>
                <QRCode value={ID} size={Dimensions.get('window').width - 60} color={projColors.currentVerse.fontAccent}/>
                <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.Title}>Закрыть</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default ModalForm;