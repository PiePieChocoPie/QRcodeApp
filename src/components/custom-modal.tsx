    import React, { useState, useEffect, useRef } from 'react';
    import { Modal, View, Text, TouchableOpacity, Dimensions, PanResponder, StyleSheet, ActivityIndicator } from 'react-native';
import { projColors } from 'src/stores/styles';
import useFonts from 'src/useFonts';

    const CustomModal = ({ visible, onClose, content, marginTOP, title }) => {
        const [modalYPosition, setModalYPosition] = useState(0);
        const [modalHeight, setModalHeight] = useState(0);
        const screenHeight = Dimensions.get('window').height;
        const minModalHeight = screenHeight * 0.3;
        const [modalPos, setModalPos] = useState(0);
        const [modifyPOS, setModifyPOS] = useState(0.2);
        const fontsLoaded = useFonts();
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
        return <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={onClose}
                >
                    <>
                    {! fontsLoaded ? (
            <View style={styles.modalContainer}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAlter} />
            </View>
        ) : (
            <>
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
                                <Text style={styles.modalTitle}>{title.substr(0, 24)} {title.length>24&&'...'}</Text>
                            )}
                            <View style={{ height: '0.5%', width: '15%', marginTop: "3%", marginBottom: "3%" }} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}>
                            {content}
                        </View>
                    </View>
                    </>
        )}</>
                </Modal>
            </View>
        ;
    };

    const styles = StyleSheet.create({
        closeButtonContainer: {
            position: 'absolute',
            top: '12%',
            right: 10,
        },
        closeButton: {
            backgroundColor: 'white',
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeButtonText: {
            color: 'black',
            fontSize: 20,
            fontFamily: 'boldFont',
    },
        modalTitle: {
            fontSize: 20,
            marginBottom: 10,
            textAlign: 'center',
            fontFamily: 'boldFont',
    },
        modalContainer: {
            width: '100%',
            backgroundColor: 'white',
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        }
    });

    export default CustomModal;
