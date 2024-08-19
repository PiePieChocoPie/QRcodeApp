import React, { useState } from "react";
import { View, Alert, ActivityIndicator, Text, StyleSheet, Dimensions } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { projColors } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import Store from "src/stores/mobx";
import CustomModal from "src/components/custom-modal";
import { getUsersTrafficStatistics } from "src/requests/timeManagement";

const Calendar = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [customDatesStyles, setCustomDatesStyles] = useState([]);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    const [fullTime, setFullTime] = useState('');
    const [middleTime, setMiddleTime] = useState('');
    const [daysCount, setDaysCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [dayData, setDayData] = useState('');
    const [dayTitle, setDayTitle] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            setYear(currentYear);
            const currentMonth = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
            setMonth(currentMonth);
            fetchData(currentYear, currentMonth);
        }, [])
    );

    const fetchData = async (year, month) => {
        try {
            startLoading();
            const res = await getUsersTrafficStatistics(month, year);
            if (res) {
                let days = 0;
                let fullTimeCounter = 0;
                const customStyles = Store.trafficData.map(day => {
                    let dayStatus = 0;
                    const startTime = new Date(day.workday_date_start).getHours() * 60 + new Date(day.workday_date_start).getMinutes();
                    dayStatus = startTime < 9 * 60 + 15 ? 0 : 1;
                    if (day.workday_complete) {
                        const endTime = new Date(day.workday_date_finish).getHours() * 60 + new Date(day.workday_date_finish).getMinutes();
                        dayStatus = endTime < 17 * 60 + 45 ? dayStatus + 1 : dayStatus;
                        fullTimeCounter = fullTimeCounter + endTime - startTime;
                        days++;
                    }
                    let color = '';
                    switch (dayStatus) {
                        case 0:
                            color = '#33ff00';
                            break;
                        case 1:
                            color = '#ffc400';
                            break;
                        case 2:
                            color = '#ff0000';
                            break;
                    }

                    return {
                        date: new Date(day.day_title.split('.').reverse().join('-')),
                        style: { backgroundColor: color },
                        textStyle: {},
                        containerStyle: [],
                        allowDisabled: true,
                    };
                });
                let hours = Math.floor(fullTimeCounter / 60);
                let minutes = fullTimeCounter % 60;
                const middleMin = fullTimeCounter / days;
                setDaysCount(days);
                setFullTime(`${hours}ч${minutes}мин`);
                hours = Math.floor(middleMin / 60);
                minutes = Math.floor(middleMin % 60);
                setMiddleTime(`${hours}ч${minutes}мин`);
                if (fullTimeCounter === 0) setMiddleTime(`0ч0мин`);
                setCustomDatesStyles(customStyles);
            } else {
                Alert.alert("Error", "Unexpected error occurred");
            }
        } catch (error) {
            Alert.alert("Error", 'Error: \n' + error);
        } finally {
            stopLoading();
        }
    };

    const handleMonthChange = async (date) => {
        startLoading();
        const newYear = date.getFullYear();
        setYear(newYear);
        const newMonth = date.getMonth() + 1;
        setMonth(newMonth);
        try {
            await fetchData(newYear, newMonth);
        } catch (err) {
            Alert.alert("Error", 'Error: \n' + err);
        }
        stopLoading();
    };

    const onDateChange = async (date) => {
        const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('.');
        const selectedDayData = Store.trafficData.find(item => item.day_title === formattedDate);

        if (selectedDayData) {
            const startTimeHours = new Date(selectedDayData.workday_date_start).getHours();
            const startTimeMinutes = new Date(selectedDayData.workday_date_start).getMinutes();
            const startTime = `начало: ${startTimeHours.toString().padStart(2, '0')}:${startTimeMinutes.toString().padStart(2, '0')}`;

            let endTime = 'рабочий день незавершен';
            if (selectedDayData.workday_complete) {
                const endTimeHours = new Date(selectedDayData.workday_date_finish).getHours();
                const endTimeMinutes = new Date(selectedDayData.workday_date_finish).getMinutes();
                const formattedEndTime = `конец: ${endTimeHours.toString().padStart(2, '0')}:${endTimeMinutes.toString().padStart(2, '0')}`;

                let durationInMinute = selectedDayData.workday_duration_final / 60;
                let duration = '';
                if (durationInMinute > 0) {
                    let hours = Math.floor(durationInMinute / 60);
                    let minutes = Math.floor(durationInMinute % 60);
                    duration = `${hours}ч${minutes}мин`;
                } else duration = 'не установлено';

                endTime = `${formattedEndTime}\nдлительность: ${duration}`;
            }

            let dayInfo = `\n${startTime}\n${endTime}`;
            toggleModal(dayInfo, formattedDate);
        }
    };

    const toggleModal = (dayInfo, dayTitle) => {
        setDayData(dayInfo);
        setDayTitle(dayTitle);
        setModalVisible(!modalVisible);
    };

    return (
        <View style={localStyles.container}>
            <View style={localStyles.calendarContainer}>
                <CalendarPicker
                    previousTitle="Предыдущий"
                    nextTitle="Следующий"
                    startFromMonday
                    weekdays={["пн", "вт", "ср", "чт", "пт", "сб", "вс"]}
                    months={['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']}
                    onMonthChange={handleMonthChange}
                    customDatesStyles={customDatesStyles}
                    onDateChange={onDateChange}
                    textStyle={localStyles.calendarText}
                    todayBackgroundColor={projColors.currentVerse.main}
                    selectedDayColor={projColors.currentVerse.fontAccent}
                    selectedDayTextColor={projColors.currentVerse.main}
                    dayShape="square"
                    customDayHeaderStyles={() => ({
                        textStyle: {
                            color: projColors.currentVerse.font,
                        },
                    })}
                />
                {loading ? (
                    <View style={localStyles.centered}>
                        <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                    </View>
                ) : (
                    <View>
                        {Store.trafficData ? (
                            <View>
                                <Text style={localStyles.infoText}>Закрыто дней - {daysCount}</Text>
                                <Text style={localStyles.infoText}>Времени на работе - {fullTime}</Text>
                                <Text style={localStyles.infoText}>Среднее время - {middleTime}</Text>
                            </View>
                        ) : (
                            <View style={localStyles.centered}>
                                <Text style={localStyles.infoText}>Записи о времени отсутствуют</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
            <CustomModal
                visible={modalVisible}
                onClose={toggleModal}
                marginTOP={0.2}
                title={dayTitle}
                content={
                    <View>
                        <Text style={localStyles.modalText}>{dayData}</Text>
                    </View>
                }
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main,
    },
    calendarContainer: {
        marginTop: "7%",
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    infoText: {
        textAlign: "center",
        marginVertical: 10,
        color: projColors.currentVerse.fontAccent,
        fontSize: 16,
    },
    modalText: {
        textAlign: "center",
        color: projColors.currentVerse.fontAccent,
        fontSize: 16,
    },
    calendarText: {
        color: projColors.currentVerse.fontAccent,
        fontSize: 16,
    },
});

export default Calendar;
