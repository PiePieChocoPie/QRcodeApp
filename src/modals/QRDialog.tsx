import React from "react";
import {Modal, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import QRCode from "react-native-qrcode-svg";
import { projColors, styles } from "src/stores/styles";
import Store from "src/stores/mobx";
const QRDialog = ({ visible, onClose }) => {
    const [qrValue] = React.useState(Store.userData[0].UF_USR_GUID);



    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.dialog}>
                    <QRCode value={qrValue} size={Dimensions.get('window').width - 60}/>
                        <TouchableOpacity   style={styles.opacities}  onPress={onClose}>
                            <Icons name="cancel" size={40} color={projColors.currentVerse.font}/>
                            <Text style={styles.text}>отмена</Text>
                        </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default QRDialog;
