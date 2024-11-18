import React, { useState } from "react";
import { View, Alert, ActivityIndicator, Text, StyleSheet } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { projColors } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import Store from "src/stores/mobx";
import CustomModal from "src/components/custom-modal";
import { getUsersTrafficStatistics } from "src/requests/timeManagement";
import useFonts from "src/useFonts";

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
    const fontsLoaded = useFonts();

    useFocusEffect(
        React.useCallback(() => {
            const currentDate = new Date();
            setYear(currentDate.getFullYear());
            setMonth(currentDate.getMonth() + 1);
            fetchData(currentDate.getFullYear(), currentDate.getMonth() + 1);
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
                        fullTimeCounter += endTime - startTime;
                        days++;
                    } else {
                        // Обычный день, когда ничего не происходило
                        dayStatus = -1; // Используем -1 для обозначения обычного дня
                    }

                    let backgroundColor = projColors.currentVerse.extra; // Цвет по умолчанию
                    let borderColor = 'transparent';

                    switch (dayStatus) {
                        case -1: // Обычный день
                            backgroundColor = projColors.currentVerse.listElementContainer; // Цвет для обычного дня
                            borderColor = 'transparent'; // Можно оставить прозрачным
                            break;
                        case 0:
                            backgroundColor = '#33ff00'; // Цвет для неполного рабочего дня
                            borderColor = '#28a745';
                            break;
                        case 1:
                            backgroundColor = '#ffc400'; // Цвет для завершенного рабочего дня
                            borderColor = '#ff9900';
                            break;
                        case 2:
                            backgroundColor = '#ff0000'; // Цвет для переработки
                            borderColor = '#DE283B';
                            break;
                    }
                    
                    return {
                        date: new Date(day.day_title.split('.').reverse().join('-')),
                        style: {
                            borderColor: borderColor,
                            borderWidth: borderColor === 'transparent' ? 0 : 1,
                            borderRadius: 3,
                        },
                        textStyle: { 
                            // borderRadius: 8,
                            color: projColors.currentVerse.font,
                            fontFamily: 'baseFont',
                        },
                        containerStyle: {
                            borderRadius: 8,
                            backgroundColor: projColors.currentVerse.listElementBackground,
                            width:50,
                            height:50,
                        },
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

    const customDatesStylesCallback = date => {
        return {
            style: {
            },
            textStyle: {
              fontSize: 13,
              fontFamily: 'baseFont'
            }
          };
      }

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
            <CalendarPicker
                onDateChange={onDateChange}
                previousTitle="Предыдущий"
                nextTitle="Следующий"
                startFromMonday
                weekdays={["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]}
                months={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']}
                onMonthChange={handleMonthChange}
                textStyle={localStyles.calendarText}
                todayBackgroundColor="transparent"
                selectedDayStyle={localStyles.selectedDayStyle}
                selectedDayColor={projColors.currentVerse.extra} // Цвет фона для выбранного дня
                selectedDayTextColor={projColors.currentVerse.font}
                dayLabelsWrapper={localStyles.dayLabelsWrapper}
                monthTitleStyle={localStyles.monthTitleStyle}
                yearTitleStyle={localStyles.yearTitleStyle}
                customDatesStyles={customDatesStyles}
                customDayHeaderStyles={customDatesStylesCallback}
            />
            {loading || !fontsLoaded ? (
        <View style={localStyles.centered}>
            <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
        </View>
    ) : (
            <View>
                <Text style={localStyles.infoText}>Закрыто дней - {daysCount}</Text>
                <Text style={localStyles.infoText}>Времени на работе - {fullTime}</Text>
                <Text style={localStyles.infoText}>Среднее время - {middleTime}</Text>
            </View>
    )}
            <CustomModal
                visible={modalVisible}
                onClose={toggleModal}
                marginTOP={0.23}
                title={dayTitle}
                content={
                    <View>
                        <Text style={localStyles.modalText}>{dayData}</Text>
                    </View>
                }
            />


        </View>
    
)};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main,
    },
    calendarText: {
        color: '#0A1629',
        fontFamily: 'baseFont',
    },
    selectedDayStyle: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#DE283B',
        borderRadius: 8,
        fontFamily: 'baseFont'
    },
    dayLabelsWrapper: {
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    monthTitleStyle: {
        fontSize: 20,
        color: '#0A1629',
        fontFamily: 'baseFont',
    },
    yearTitleStyle: {
        fontSize: 20,
        color: '#0A1629',
        fontFamily: 'baseFont',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: projColors.currentVerse.main,
    },
    infoText: {
        backgroundColor: projColors.currentVerse.listElementBackground,
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        color: projColors.currentVerse.fontAccent,
        fontFamily: 'baseFont',
        marginTop: 5,
        fontSize: 16,
    },
    modalText: {
        color: projColors.currentVerse.font,
        fontFamily: 'baseFont',
        textAlign: 'center',
    },
});

export default Calendar;
