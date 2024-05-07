import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, PanResponder, } from 'react-native';
import { styles } from "src/stores/styles";
import CalendarPicker from 'react-native-calendar-picker';
import Store from "src/stores/mobx";
import MultiSelect from "src/components/picker-select"

const ModalForm = ({ modalVisible, toggleModal, reportName }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null); 
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalYPosition, setModalYPosition] = useState(0);
  const [modalHeight, setModalHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const minModalHeight = screenHeight * 0.3;




  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartDate(date); 
    setShowCalendar(false);
  };

  useEffect(() => {
    if (!modalVisible) {
      setModalYPosition(0);
      setModalHeight(0);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (modalYPosition > minModalHeight) {
      toggleModal();
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
          toggleModal();
        } else {
          setModalHeight(0.7 * screenHeight);
          setModalYPosition(0);
        }
      },
    })
  ).current;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
        <TouchableOpacity
            activeOpacity={1}
            onPress={toggleModal}
            style={{ flex: 1 }}
        >
            <View style={[styles.modalContainer, { marginTop: modalYPosition + screenHeight * 0.2, height: modalHeight }]} {...panResponder.panHandlers}>
                {reportName && (
                <View style={{ width: '80%', flex: 1 }}>

                    <View style={{ height: '0.5%', width: '20%', backgroundColor: 'black', left: '40%', marginTop:"3%", marginBottom:"3%"}} />
                    {/* ИмяОтчета*/}
                    <Text style={styles.modalTitle}>{reportName.name}</Text>
                    
                    <View style={styles.filterContainer}>

                        <MultiSelect storages={Store.storages}/>
                     
                    </View>

                    <View style={styles.parameterContainer}>

                    </View>
                    {reportName.parameters.map((parameter, index) => (
                    <View key={index} >
                        <Text>{parameter.view}:</Text>
                        <TouchableOpacity onPress={() => setShowCalendar(true)}>
                        <View style={styles.dateField}>
                            <Text style={selectedDate ? styles.selectedDateText : styles.placeholderText}>
                            {selectedDate ? selectedDate.toString() : 'Выберите дату'}
                            </Text>
                            {showCalendar && (
                            <CalendarPicker
                                onDateChange={handleDateChange}
                                allowRangeSelection={false}
                                selectedDayColor="#7300e6"
                                selectedDayTextColor="#FFFFFF"
                                selectedStartDate={selectedStartDate}
                            />
                            )}
                        </View>
                        </TouchableOpacity>
                    </View>
                    ))}
                </View>
                )}
            </View>
      
        </TouchableOpacity>
    </Modal>
  );
};

export default ModalForm;