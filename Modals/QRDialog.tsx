import React from "react";
import {Modal, View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import QRCode from "react-native-qrcode-svg";
import authStore from "../stores/authStore";
import projColors from "../stores/staticColors";
const QRDialog = ({ visible, onClose }) => {
    const [qrValue] = React.useState(authStore.userData[0].UF_USR_GUID);



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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: projColors.currentVerse.second,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderColor:projColors.currentVerse.main,
        borderWidth:2,
    },
    text: {
        marginVertical: 10,
        fontSize: 16,
        textAlign: "center",
        color:projColors.currentVerse.font
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

export default QRDialog;
