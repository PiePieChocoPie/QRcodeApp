import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, PanResponder, } from 'react-native';
import { styles } from "src/stores/styles";
import CalendarPicker from 'react-native-calendar-picker';
import Store from "src/stores/mobx";
import MultiSelect from "src/components/picker-select"
import ClientSelect from "src/components/clients-select"
import CustomModal from 'src/components/custom-modal';
import { Button } from 'react-native-paper';
<<<<<<< HEAD
import {getHierarchy} from 'src/http'

const ModalForm = ({ modalVisible, toggleModal, reportName }) => {
const [selectedDate, setSelectedDate] = useState(null);
const [selectedStartDate, setSelectedStartDate] = useState(null); 
=======

const ModalForm = ({ modalVisible, toggleModal, reportName }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null); 
  const [selectedEndDate, setSelectedEndDate] = useState(null); 
>>>>>>> 02ac034e228b1a57c4d8a3979c23033efd033ce9
const [showCalendarModal, setShowCalendarModal] = useState(false);
  const handleSingleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartDate(date); 
    setShowCalendarModal(false);
    console.log(reportName.parameters)
  };
<<<<<<< HEAD
  const ReqRepost = async () => {
=======
  const handleMultipleDateChange = (firstDate,lastDate) => {
    setSelectedDate(firstDate);
    setSelectedStartDate(firstDate); 
    setSelectedEndDate(lastDate); 
    setShowCalendarModal(false);
    console.log(reportName.parameters)
  };
  const handleDateChange = async(date, type) => {
    console.log(type)
    setSelectedDate((prevSelectedDate) => {
      if (type === "END_DATE") {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null); // Сбрасываем конечную дату при выборе новой начальной даты
      }
      return date; // Возвращаем новое значение выбранной даты
    });
    console.log('1 - '+selectedStartDate)
    console.log('2 - '+selectedEndDate +`\n`)
  };
  
>>>>>>> 02ac034e228b1a57c4d8a3979c23033efd033ce9

    const response = await getHierarchy();
    console.log(JSON.stringify(response.data));

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

                  <Text>{reportName.filters[0].view}</Text>

                  <MultiSelect storages={Store.storages} title={'Выберите склады'}/>

               
              </View>
              <View style={styles.filterContainer}>
                 <ClientSelect/>
              </View>


              {reportName.parameters.map((parameter, index) => (
                <View key={index}>
                  <Text>{parameter.view}:</Text>
<<<<<<< HEAD
                  <TouchableOpacity style={styles.textInput} onPress={() => setShowCalendarModal(true)}>
                  <View style={styles.dateField}>
=======
                  <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
                    <View style={styles.dateField}>
>>>>>>> 02ac034e228b1a57c4d8a3979c23033efd033ce9
                      <Text style={selectedDate ? styles.selectedDateText : styles.placeholderText}>
                        {selectedDate ? selectedDate.toString() : 'Выберите дату'}
                      </Text>
                      <CustomModal
                        visible={showCalendarModal}
                        onClose={() => setShowCalendarModal(false)}
                        content={showCalendarModal && (
                          <View>
                          <CalendarPicker
                            onDateChange={handleDateChange}
                            allowRangeSelection={parameter.view == 'Период'}
                            allowBackwardRangeSelect={parameter.view == 'Период'}
                            selectedDayColor="#7300e6"
                            selectedDayTextColor="#FFFFFF"
                            selectedStartDate={selectedStartDate} 
                            selectedEndDate={selectedEndDate}/>
                            <Button onPress={()=>setShowCalendarModal(!showCalendarModal)}>применить</Button>
                          </View>
                        )} />
                    </View>
                  </TouchableOpacity>
<<<<<<< HEAD
                  <Button onPress={ReqRepost}>
                    <Text>Запросить отчет</Text>
                  </Button>
              </View>
=======
                </View>
>>>>>>> 02ac034e228b1a57c4d8a3979c23033efd033ce9
              ))}
          </View>
          )
      }
    />

  );
};

export default ModalForm;