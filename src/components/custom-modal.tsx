import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions, PanResponder, Button } from 'react-native';
import { styles } from "src/stores/styles";

const ModalBackdrop = ({ visible, onPress, content}) => {
  return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={onPress}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={[styles.backdrop]}
        >
          {content}
        </TouchableOpacity>
      </Modal>
  );
};

const CustomModal = ({ visible, onClose, content, marginTOP,title }) => {
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
          style={{flex:1}}
        >
        <ModalBackdrop visible={visible} onPress={onClose} content={
        <View style={[styles.modalContainer, { marginTop: modalPos, height: modalHeight}]}>
          <View
            style={{ height: '10%', width: '100%', backgroundColor: 'white',borderRadius: 15, justifyContent: 'center' }}
            {...panResponder.panHandlers}
          >
            <Text style={styles.modalTitle}> {title}</Text>
            <View style={{ width: '15%', marginTop: "3%", marginBottom: "3%" }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
              {content}
          </View>
        </View>
        }/>
      </Modal>
    </View>
  );
};

export default CustomModal;

// import React, { useState, useEffect, useRef } from 'react';
// import { Modal, View, Text, TouchableOpacity, Dimensions, PanResponder } from 'react-native';

// const ModalBackdrop = ({ visible, onPress }) => {
//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onPress}
//     >
//       <TouchableOpacity
//         activeOpacity={1}
//         onPress={onPress}
//         style={{
//           flex: 1,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       />
//     </Modal>
//   );
// };

// const CustomModal = ({ visible, onClose, content, marginTOP, title }) => {
//   const [modalYPosition, setModalYPosition] = useState(0);
//   const [modalHeight, setModalHeight] = useState(0);
//   const screenHeight = Dimensions.get('window').height;
//   const minModalHeight = screenHeight * 0.3;
//   const [modalPos, setModalPos] = useState(screenHeight * 0.3);
//   const [modifyPOS, setModifyPOS] = useState(0.2);

//   useEffect(() => {
//     if (visible) {
//       resize();
//     } else {
//       setModalYPosition(0);
//       setModalHeight(0);
//       setModalPos(screenHeight * 0.3);
//     }
//   }, [visible]);

//   useEffect(() => {
//     if (modalYPosition > minModalHeight) {
//       onClose();
//     } else {
//       setModalPos(modalYPosition + screenHeight * modifyPOS);
//     }
//   }, [modalYPosition]);

//   useEffect(() => {
//     setModalPos(modalYPosition + screenHeight * modifyPOS);
//   }, [modifyPOS]);

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gestureState) => {
//         const { dy } = gestureState;
//         setModalYPosition(dy);
//       },
//       onPanResponderRelease: () => {
//         if (modalYPosition > minModalHeight) {
//           onClose();
//         } else {
//           setModalHeight(0.7 * screenHeight);
//           setModalYPosition(0);
//         }
//       },
//     })
//   ).current;

//   const resize = () => {
//     setModifyPOS(marginTOP);
//   };

//   return (
//     <View>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}
//       >
//         <ModalBackdrop visible={visible} onPress={onClose} />
//         <View style={{
//           backgroundColor: 'white',
//           borderTopLeftRadius: 15,
//           borderTopRightRadius: 15,
//           overflow: 'hidden',
//           marginTop: modalPos,
//           height: '100%',
//         }}>
//           <View
//             style={{
//               height: '10%',
//               width: '100%',
//               backgroundColor: 'white',
//               borderRadius: 15,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//             {...panResponder.panHandlers}
//           >
//             <Text style={{
//               fontSize: 18,
//               fontWeight: 'bold',
//               textAlign: 'center',
//             }}>
//               {title}
//             </Text>
//             <View style={{ height: '0.5%', width: '15%', marginTop: '0%', marginBottom: '0%' }} />
//           </View>
//           <View style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             paddingHorizontal: 20,
//           }}>
//             {content}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default CustomModal;
