import { useEffect, useState } from "react";
import { View,Text, TouchableOpacity} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Toast from "react-native-root-toast";
import CalendarPicker from 'react-native-calendar-picker';
//
import Store from 'src/stores/mobx';
import useLoading from "src/useLoading";
import { projColors, styles } from 'src/stores/styles';
import CustomModal from 'src/components/custom-modal';

const CalendarPickerModal = ({parameter}) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [isPeriod, setPeriod] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        console.log('Selected Start Date:', selectedStartDate);
        console.log('Selected End Date:', selectedEndDate);
        if (selectedStartDate) {
            Store.setMainDate(selectedStartDate);
            if (selectedEndDate) {
                Store.setExtraDate(selectedEndDate);
            }
        }
    },[selectedStartDate, selectedEndDate]);

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

      const formatDateString = (date) => {
        if (!date) return 'Выберите дату';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
      };

      const terminateModal = () => {
        setModalVisible(false);
        Store.setMainDate(selectedStartDate);
        if (isPeriod) {
          Store.setExtraDate(selectedEndDate);
        }
        console.log('terminateModal:', selectedStartDate, selectedEndDate, '\n', "записаны - ", Store.mainDate, Store.extraDate);
      };
    

    return (
        <TouchableOpacity style={styles.textInput} onPress={() => setModalVisible(true)}>
            <View style={styles.dateField}>
            <Text style={selectedDate ? styles.selectedDateText : styles.placeholderText}>
                {selectedDate ? (parameter === 'Период' ? `${formatDateString(Store.mainDate)} - ${formatDateString(Store.extraDate)}` : formatDateString(selectedStartDate)) : 'Выберите дату'}
            </Text>
            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                content={
                    <View>
                        <CalendarPicker
                            onDateChange={parameter === 'Дата отчёта' ? handleSingleDateChange : handleDateChange}
                            allowRangeSelection={parameter !== 'Дата отчёта'}
                            allowBackwardRangeSelect
                            selectedDayColor="#7300e6"
                            selectedDayTextColor="#FFFFFF"
                            selectedStartDate={selectedStartDate}
                            selectedEndDate={parameter !== 'Дата отчёта' ? selectedEndDate : null}
                            todayBackgroundColor="#f2e6ff"
                            previousTitle="Предыдущий"
                            nextTitle="Следующий"
                            startFromMonday
                            weekdays={['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']}
                            months={['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']}
                        />
                        <Button onPress={terminateModal}>Закрыть</Button>
                    </View>
                }
            />
        </View>
      </TouchableOpacity>
    );
};
export default CalendarPickerModal;