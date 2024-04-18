import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { getUsersTrafficStatistics } from "src/http";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";

export default function Calendar() {
    const { loading, startLoading, stopLoading } = useLoading();
    const [markedDates, setMarkedDates] = useState({});
    const [customDatesStyles, setCustomDatesStyles] = useState([])
    // Формируем массив объектов для customDatesStyles
    
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, []) 
    );

    const fetchData = async () => {
        try {
            startLoading();
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // Добавляем 1, так как месяцы в JS начинаются с 0
            const res = await getUsersTrafficStatistics(currentMonth, currentYear);
            console.log(res.days)
            const customStyles = res.days.map(day => {
                const startTime = new Date(day.workday_date_start).getHours() * 60 + new Date(day.workday_date_start).getMinutes();
                const color = startTime < 9 * 60 + 15 ? '#FFD700' : '#FFA07A'; // Если время меньше 09:15, то желтый, иначе оранжевый
                return {
                    date: new Date(day.day_title.split('.').reverse().join('-')),
                    style: { backgroundColor: color },
                    textStyle: {},
                    containerStyle: [],
                    allowDisabled: true,
                };
            });
            setCustomDatesStyles(customStyles);
        
        } catch (error) {
            Alert.alert("Ошибка", 'Ошибка: \n' + error);
        } finally {
            stopLoading();
        }
    };


    const handleMonthChange = async (date) => {
        startLoading();
        console.log('Новый выбранный месяц:', date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        console.log(year,month)
        try {
            const res = await getUsersTrafficStatistics(year, month);
            console.log(res.days)
        } catch (err) {
            Alert.alert("Ошибка", 'Ошибка: \n' + err);
        }
        stopLoading();
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                <CalendarPicker
                    previousTitle="Предыдущий"
                    nextTitle="Следующий"
                    startFromMonday
                    weekdays={["пн", "вт", "ср", "чт", "пт", "сб", "вс"]}
                    months={['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']}
                    onMonthChange={handleMonthChange}
                    customDatesStyles={customDatesStyles} // Если вам нужно будет использовать стилизацию для определенных дат
                    // onDateChange={undefined}
                />
            )}
        </View>
    );
}
