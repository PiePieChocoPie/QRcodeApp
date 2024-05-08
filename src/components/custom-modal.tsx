import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import { styles } from "src/stores/styles";
const ModalBackdrop = ({ visible, onPress }) => {
  return (
    <Modal
      animationType="fade" 
      transparent={true}
      visible={visible}
      onRequestClose={onPress}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.backdrop}
      />
    </Modal>
  );
};

const CustomModal = ({ visible, onClose, content }) => {
  const [modalYPosition, setModalYPosition] = useState(0);
  const [modalHeight, setModalHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const minModalHeight = screenHeight * 0.3;

  useEffect(() => {
    if (!visible) {
      setModalYPosition(0);
      setModalHeight(0);
    }
  }, [visible]);

  useEffect(() => {
    if (modalYPosition > minModalHeight) {
      onClose();
    }
  }, [modalYPosition]);

  const panResponder = React.useRef(
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

  return (
    <>
      <ModalBackdrop visible={visible} onPress={onClose} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ flex: 1 }}
        >
          <View style={[styles.modalContainer, { marginTop: modalYPosition + screenHeight * 0.2, height: modalHeight }]} {...panResponder.panHandlers}>
            <View style={{ height: '0.5%', width: '15%', backgroundColor: 'black', left: '0%', marginTop:"3%", marginBottom:"3%"}} />
            {content}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};


export default CustomModal;