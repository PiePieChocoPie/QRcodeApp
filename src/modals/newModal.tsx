import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, PanResponder, } from 'react-native';
import { styles } from "src/stores/styles";
import CalendarPicker from 'react-native-calendar-picker';
import Store from "src/stores/mobx";
import MultiSelect from "src/components/picker-select"
import CustomModal from 'src/components/custom-modal';

const ModalForm = ({ modalVisible, toggleModal, reportName }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null); 
const [showCalendarModal, setShowCalendarModal] = useState(false);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartDate(date); 
    setShowCalendarModal(false);
  };

  return (
    <CustomModal
      visible={modalVisible}
      onClose={toggleModal}
      content={
        reportName && (
          <View style={{ width: '80%', flex: 1 }}>

              <Text style={styles.modalTitle}>{reportName.name}</Text>
              
              <View style={styles.filterContainer}>

                  <MultiSelect storages={Store.storages}/>
               
              </View>

              <View style={styles.parameterContainer}>

              </View>
              {reportName.parameters.map((parameter, index) => (
              <View key={index} >
                  <Text>{parameter.view}:</Text>
                  <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
                  <View style={styles.dateField}>
                      <Text style={selectedDate ? styles.selectedDateText : styles.placeholderText}>
                      {selectedDate ? selectedDate.toString() : 'Выберите дату'}
                      </Text>
                      <CustomModal
                      visible={showCalendarModal}
                      onClose={() => setShowCalendarModal(false)}
                      content={
                        showCalendarModal && (
                          <CalendarPicker
                              onDateChange={handleDateChange}
                              allowRangeSelection={false}
                              selectedDayColor="#7300e6"
                              selectedDayTextColor="#FFFFFF"
                              selectedStartDate={selectedStartDate}
                          />
                          )
                      }
                      />
                  </View>
                  </TouchableOpacity>
              </View>
              ))}
          </View>
          )
      }
    />

  );
};

export default ModalForm;