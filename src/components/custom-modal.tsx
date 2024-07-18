import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions, PanResponder, Animated } from 'react-native';
import { styles } from "src/stores/styles";

const CustomModal = ({ visible, onClose, content, marginTOP, title }) => {
    const [modalYPosition, setModalYPosition] = useState(0);
    const [modalHeight, setModalHeight] = useState(0);
    const screenHeight = Dimensions.get('window').height;
    const minModalHeight = screenHeight * 0.3;
    const [modalPos, setModalPos] = useState(0);
    const [modifyPOS, setModifyPOS] = useState(0.2);

    useEffect(() => {
        if (!visible) {
            setModalYPosition(0);
            setModalHeight(0);
        } else {
            resize();
        }
    }, [visible]);

    useEffect(() => {
        if (modalYPosition > minModalHeight) {
            onClose();
        }
        setModalPos(modalYPosition + screenHeight * modifyPOS);
    }, [modalYPosition]);

    useEffect(() => {
        setModalPos(modalYPosition + screenHeight * modifyPOS);
    }, [modifyPOS]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const { dy } = gestureState;
                setModalYPosition(dy);
            },
            onPanResponderRelease: () => {
                if (modalYPosition > minModalHeight) {
                    onClose();
                } else {
                    setModalHeight(0.7 * screenHeight);
                    setModalYPosition(0);
                }
            },
        })
    ).current;

    const resize = () => {
        setModifyPOS(marginTOP);
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                {/* <View style={[styles.dimmedBackground]}> */}
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.modalContainer, { marginTop: modalPos, height: modalHeight }]}>
                        <View
                            style={{ height: '10%', width: '100%', backgroundColor: 'white', borderRadius: 15, justifyContent: 'center' }}
                            {...panResponder.panHandlers}
                        >
                            {title && (
                                <Text style={styles.modalTitle}>{title.substr(0, 24) + '...'}</Text>
                            )}
                            <View style={{ height: '0.5%', width: '15%', marginTop: "3%", marginBottom: "3%" }} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}>
                            {content}
                        </View>
                    </View>
                {/* </View> */}
            </Modal>
        </View>
    );
};

export default CustomModal;