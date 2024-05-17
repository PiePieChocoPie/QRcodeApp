import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { projColors, styles } from 'src/stores/styles';
import CalendarPicker from 'react-native-calendar-picker';
import Store from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import ClientSelect from 'src/components/clients-select';
import CustomModal from 'src/components/custom-modal';
import { Button } from 'react-native-paper';
import { getHierarchy, getClients, getStorages } from 'src/http';
import { useFocusEffect } from 'expo-router';
import Toast from 'react-native-root-toast';
import useLoading from 'src/useLoading';

const ModalForm = ({ modalVisible, toggleModal, reportName, reportKey }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isPeriod, setPeriod] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();


  useEffect(() => {
    console.log('Selected Start Date:', selectedStartDate);
    console.log('Selected End Date:', selectedEndDate);
    startLoading();
    Store.setMainDate(selectedStartDate);
    Store.setExtraDate(selectedEndDate);
    stopLoading();
  }, [selectedStartDate, selectedEndDate]);

  const ReqReport = async () => {
    const response = await getHierarchy();
    let parameter = isPeriod?[selectedStartDate, selectedEndDate]:[selectedStartDate];
    let jsonBody = {
      name: reportKey,
      filter:{
        value: "someValue",
        name: reportName.filters[0].using,
      },
      parameter:{
        value:parameter
      }
    };
    console.log(jsonBody);
  };

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
    setPeriod(false);
    console.log("Одиночная дата", date);
    Toast.show(`Одиночная дата - ${date}`, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
    });
    setSelectedDate(date);
    setSelectedStartDate(date);
    setSelectedEndDate(null);
    terminateModal();
  };

  const handleDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
      setPeriod(true);
    } else {
      setSelectedStartDate(date);
      setSelectedDate(date);
      setPeriod(false);
    }
  };

  const terminateModal = () => {
    setShowCalendarModal(false);
    Store.setMainDate(selectedStartDate);
    if (isPeriod) {
      Store.setExtraDate(selectedEndDate);
    }
    console.log('terminateModal:', selectedStartDate, selectedEndDate, '\n', "записаны - ", Store.mainDate, Store.extraDate);
  };

  const formatDateString = (date) => {
    if (!date) return 'Выберите дату';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
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
                    <Text style={selectedDate ? styles.selectedDateText : styles.placeholderText}>
                      {selectedDate ? (parameter.view === 'Период' ? `${formatDateString(Store.mainDate)} - ${formatDateString(Store.extraDate)}` : formatDateString(selectedStartDate)) : 'Выберите дату'}
                    </Text>
                    <CustomModal
                      visible={showCalendarModal}
                      onClose={() => setShowCalendarModal(false)}
                      content={
                        showCalendarModal && (
                          ( loading ? (
                            <View style={styles.containerCentrallity}>
                                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                            </View>
                            ) : 
                            (
                            parameter.view === 'Период' ? (
                              <View>
                                <CalendarPicker
                                  onDateChange={handleDateChange}
                                  allowRangeSelection
                                  allowBackwardRangeSelect
                                  selectedDayColor="#7300e6"
                                  selectedDayTextColor="#FFFFFF"
                                  selectedStartDate={selectedStartDate}
                                  selectedEndDate={selectedEndDate}
                                  todayBackgroundColor="#f2e6ff"
                                  previousTitle="Предыдущий"
                                  nextTitle="Следующий"
                                  startFromMonday
                                  weekdays={['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']}
                                  months={['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']}
                                />
                                <Button onPress={terminateModal}>Применить</Button>
                              </View>
                            ) : (
                              <CalendarPicker
                                onDateChange={handleSingleDateChange}
                                allowRangeSelection={false}
                                selectedDayColor="#7300e6"
                                selectedDayTextColor="#FFFFFF"
                                selectedStartDate={selectedStartDate}
                              />
                            )
                          ))
                        )
                      }
                    />
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
