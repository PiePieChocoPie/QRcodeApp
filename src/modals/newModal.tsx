import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from 'src/stores/styles';
import CalendarPicker from 'react-native-calendar-picker';
import Store from 'src/stores/mobx';
import MultiSelect from 'src/components/picker-select';
import ClientSelect from 'src/components/clients-select';
import CustomModal from 'src/components/custom-modal';
import { Button } from 'react-native-paper';
import { getHierarchy } from 'src/http';

const ModalForm = ({ modalVisible, toggleModal, reportName }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isPeriod, setPeriod] = useState(false);

  const handleSingleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStartDate(date);
    setShowCalendarModal(false);
  };

  const ReqReport = async () => {
    const response = await getHierarchy();
    console.log(JSON.stringify(response.data));
  };

  const handleDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
      setPeriod(true);
    } else {
      setSelectedStartDate(date);
      setSelectedDate(date);
    }
  };

  const terminateModal = () => {
    setShowCalendarModal(false);
    Store.setMainDate(selectedStartDate);
    Store.setExtraDate(selectedEndDate);
    console.log(selectedStartDate, selectedEndDate);
  };

  const formatDateString = (date) => {
    if (!date) return 'Выберите дату';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль
    const day = String(date.getDate()).padStart(2, '0'); // добавляем ведущий ноль
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
              <MultiSelect storages={Store.storages} title={'Выберите склады'} />
            </View>
            <View style={styles.filterContainer}>
              <ClientSelect />
            </View>
            {reportName.parameters.map((parameter, index) => (
              <View key={index}>
                <Text>{parameter.view}:</Text>
                <TouchableOpacity style={styles.textInput} onPress={() => setShowCalendarModal(true)}>
                  <View style={styles.dateField}>
                    <Text style={selectedDate ? styles.selectedDateText : styles.placeholderText}>
                      {selectedDate ? parameter.view == 'Период'? `${formatDateString(Store.mainDate)} - ${formatDateString(Store.extraDate)}`:formatDateString(Store.mainDate) : 'Выберите дату'}
                    </Text>
                    <CustomModal
                      visible={showCalendarModal}
                      onClose={() => setShowCalendarModal(false)}
                      content={
                        showCalendarModal && (
                          <View>
                            <CalendarPicker
                              onDateChange={parameter.view === 'Период' ? handleDateChange : handleSingleDateChange}
                              allowRangeSelection={parameter.view === 'Период'}
                              allowBackwardRangeSelect={parameter.view === 'Период'}
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
                            <Button onPress={terminateModal}>применить</Button>
                          </View>
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
