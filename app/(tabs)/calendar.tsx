import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { getUsersTrafficStatistics } from "src/http";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";

export default function Calendar() {
  const [startDate, setStartDate] = useState('');
  const { loading, startLoading, stopLoading } = useLoading();
  const [markedDates, setMarkedDates] = useState({});

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
      markDates(res.days, currentMonth, currentYear);
    } catch (error) {
      Alert.alert("Ошибка", 'Ошибка: \n' + error);
    } finally {
      stopLoading();
    }
  };

  const markDates = (trafficData, currentMonth, currentYear) => {
    const markedDates = {};
    trafficData.forEach(day => {
      const dayDate = new Date(day.day_title.split('.').reverse().join('-'));
      const dayStart = new Date(day.workday_date_start);
      const hour = dayStart.getHours();
      const minute = dayStart.getMinutes();

      // Проверяем, произошло ли начало дня после 9:15
      if (hour > 9 || (hour === 9 && minute > 15)) {
        markedDates[day.day_title] = { selected: true, selectedColor: 'red' }; // Красный цвет для дней, начавшихся после 9:15
      } else {
        markedDates[day.day_title] = { selected: true, selectedColor: 'green' }; // Зеленый цвет для дней, начавшихся до или в 9:15
      }
    });
    
    // Добавляем раскрашивание оранжевым цветом для не заполненных дней
    const allDates = Array.from(new Array(31), (x, i) => i + 1).map(day => {
      const formattedDay = day < 10 ? `0${day}` : day.toString();
      return `${formattedDay}.${currentMonth}.${currentYear}`;
    });
    
    allDates.forEach(date => {
      if (!markedDates[date]) {
        markedDates[date] = { selected: true, selectedColor: 'orange' };
      }
    });

    setMarkedDates(markedDates);
};


  const handleMonthChange = async (date) => {
    startLoading();
    console.log('Новый выбранный месяц:', date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    try {
      const res = await getUsersTrafficStatistics(year, month);
      markDates(res.days, month, year);
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
          onMonthChange={handleMonthChange}
          onDateChange={undefined}
          markedDates={markedDates} // Передаем markedDates в CalendarPicker
        />
      )}
    </View>
  );
}
