import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from 'src/stores/styles';
import CalendarPicker from 'react-native-calendar-picker';
import Store from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import ClientSelect from 'src/components/clients-select';
import CustomModal from 'src/components/custom-modal';
import { Button } from 'react-native-paper';
import { getHierarchy, getClients, getStorages } from 'src/http';
import { useFocusEffect } from 'expo-router';

const ModalForm = ({ modalVisible, toggleModal, reportName }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  useEffect(() => {
    getClients('ee4874d1-db5d-11e9-8160-e03f4980f4ff');
    // console.log(Store.clients)
  }, []);
  useFocusEffect(() => {
    getStorages(Store.userData.UF_USR_STORAGES);
    // console.log(Store.userData.UF_USR_STORAGES)
    console.log(Store.storages)
  },);
  const handleSingleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartDate(date);
    setShowCalendarModal(false);
    console.log(reportName.parameters);
  };

  const ReqReport = async () => {
    const response = await getClients("ee4874d1-db5d-11e9-8160-e03f4980f4ff");
    console.log(response.data);
  };

  const handleMultipleDateChange = (firstDate, lastDate) => {
    setSelectedDate(firstDate);
    setSelectedStartDate(firstDate);
    setSelectedEndDate(lastDate);
    setShowCalendarModal(false);
    console.log(reportName.parameters);
  };

  const handleDateChange = async (date, type) => {
    console.log(type);
    setSelectedDate((prevSelectedDate) => {
      if (type === 'END_DATE') {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
      return date;
    });
    console.log('1 - ' + selectedStartDate);
    console.log('2 - ' + selectedEndDate + `\n`);
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
            {reportName.filters[0].view === "Склады" ? (
                <MultiSelect jsonData={Store.storages} title={'Выберите склады'}/>
            ) : (
                // <ClientSelect/>
                <MultiSelect jsonData={Store.clients} title={'Выберите клиентов'}/>
            )}

            </View>

            {reportName.parameters.map((parameter, index) => (
              <View key={index}>
                <Text>{parameter.view}:</Text>
                <TouchableOpacity style={styles.textInput} onPress={() => setShowCalendarModal(true)}>
                  <View style={styles.dateField}>
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
                              <View>
                                <CalendarPicker
                                  onDateChange={handleDateChange}
                                  allowRangeSelection={parameter.view == 'Период'}
                                  allowBackwardRangeSelect={parameter.view == 'Период'}
                                  selectedDayColor="#7300e6"
                                  selectedDayTextColor="#FFFFFF"
                                  selectedStartDate={selectedStartDate}
                                  selectedEndDate={selectedEndDate}
                                />
                                <Button onPress={() => setShowCalendarModal(!showCalendarModal)}>применить</Button>
                              </View>
                            )
                          }
                        />
                      </View>
                    </TouchableOpacity>

                  </View>
                    
                </TouchableOpacity>





                <Button onPress={ReqReport}>
                      <Text>Запросить отчет</Text>
                    </Button>
              </View>
            ))}
          </View>
        )
      }
    />
  );
};

export default ModalForm;