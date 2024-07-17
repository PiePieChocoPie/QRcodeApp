import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-root-toast";
import CalendarPicker from 'react-native-calendar-picker';
import Store from 'src/stores/mobx';
import { styles } from 'src/stores/styles';
import CustomModal from 'src/components/custom-modal';

const CalendarPickerModal = ({ parameter }) => {
    // Initialize default dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const [selectedDate, setSelectedDate] = useState(yesterday); // Yesterday selected by default
    const [selectedStartDate, setSelectedStartDate] = useState(yesterday); // Yesterday selected by default
    const [selectedEndDate, setSelectedEndDate] = useState(today); // Today selected by default
    const [isPeriod, setPeriod] = useState(parameter === 'Период');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (selectedStartDate) {
            Store.setMainDate(selectedStartDate);
            if (selectedEndDate) {
                Store.setExtraDate(selectedEndDate);
            }
        }
    }, [selectedStartDate, selectedEndDate]);

    const handleSingleDateChange = (date) => {
        setPeriod(false);
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
    };

    return (
        <TouchableOpacity style={styles.textInput} onPress={() => setModalVisible(true)}>
            <View style={styles.dateField}>
                <Text style={selectedDate ? styles.Text : styles.Title}>
                    {selectedDate ? 
                        (parameter === 'Период' ? `${formatDateString(selectedStartDate)} - ${formatDateString(selectedEndDate)}` : formatDateString(selectedStartDate)) 
                        : 'Выберите дату'}
                </Text>
                <CustomModal
                    title="Календарь"
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    marginTOP={0.24}
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
