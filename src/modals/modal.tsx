import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { projColors } from 'src/stores/styles'; // Assuming projColors are imported from styles.ts
import QRCode from 'react-native-qrcode-svg';
import CustomModal from 'src/components/custom-modal'; // Importing CustomModal from custom-modal.tsx

const ModalForm = ({ modalVisible, toggleModal, ID }) => {

    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
        },
        modalContent: {
            backgroundColor: '#fff',
            // padding: 20,
            borderRadius: 10,
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        closeButton: {
            marginTop: 20,
            padding: 10,
            backgroundColor: projColors.currentVerse.font, // Using projColors from styles
            borderRadius: 5,
        },
        closeButtonText: {
            fontSize: 18,
            color: '#fff',
        },
    });

    return (
        <CustomModal
            visible={modalVisible}
            onClose={toggleModal}
            marginTOP={0.2} // Example custom prop
            title={"QR - Code"} // Example custom prop
            content={
                // <View style={styles.modalContainer}>
                    <View 
                    style={styles.modalContent}
                    >
                        <QRCode value={ID} size={Dimensions.get('window').width - 100} color={projColors.currentVerse.font} />

                    {/* </View> */}
                </View>
            }
        />
    );
};

export default ModalForm;
