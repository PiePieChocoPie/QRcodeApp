import React, { useState} from "react";
import { View, Alert, ActivityIndicator, Text } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { getUsersTrafficStatistics } from "src/http";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import Store from "src/stores/mobx";


export default function Calendar() {
    const { loading, startLoading, stopLoading } = useLoading();
    const [customDatesStyles, setCustomDatesStyles] = useState([]);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    const [fullTime, setFullTime] = useState('');
    const [middleTime, setmiddleTime] = useState('');
    const [daysCount, setDaysCount] = useState(0);
    const [modalVisible, setModalVisible] = React.useState(false);

    // Формируем массив объектов для customDatesStyles
    
    useFocusEffect(
        React.useCallback(() => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            setYear(currentYear)
            const currentMonth = currentDate.getMonth() + 1; // Добавляем 1, так как месяцы в JS начинаются с 0
            setMonth(currentMonth)
            fetchData(currentYear,currentMonth);
        }, []) 
    );

    const fetchData = async (year, month) => {
        try {
            startLoading();           
            await getUsersTrafficStatistics(month, year)            
            .then((res)=>{    
                if(res){
                    console.log(Store.trafficData);
                    let days = 0;
                    let fullTimeCounter = 0;
                    const customStyles = Store.trafficData.map(day => {
                        let dayStatus = 0;
                        const startTime = new Date(day.workday_date_start).getHours() * 60 + new Date(day.workday_date_start).getMinutes();
                        console.log('начало дня - ', startTime)
                        dayStatus = startTime < 9 * 60 + 15 ? 0 : 1;
                        if (day.workday_complete){
                            const endTime = new Date(day.workday_date_finish).getHours() * 60 + new Date(day.workday_date_finish).getMinutes();
                            console.log('конец дня - ',endTime)
                            dayStatus = endTime < 17 * 60 + 45 ? dayStatus+1 : dayStatus;
                            fullTimeCounter = fullTimeCounter + endTime-startTime;
                            days++;
                        }
                        console.log(day.day_title,dayStatus)
                        let color = '';
                        switch(dayStatus){
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
                    let hours = Math.floor(fullTimeCounter / 60); // Получаем количество целых часов
                    console.log(fullTimeCounter)
                    let minutes = fullTimeCounter % 60;
                    const middleMin = fullTimeCounter/days;
                    setDaysCount(days);
                    setFullTime(`${hours}ч${minutes}мин`);
                    hours = Math.floor(middleMin / 60); // Получаем количество целых часов
                    minutes =  Math.floor(middleMin % 60);
                    setmiddleTime(`${hours}ч${minutes}мин`)
                    if(fullTimeCounter==0)  
                    setmiddleTime(`0ч0мин`)
                    setCustomDatesStyles(customStyles);
            }
            else{
                Alert.alert("ошибка", "непредвиденная ошибка")
            }
        })
        .catch((err)=>{
            Alert.alert("ошибка",err)
        })

        
        } catch (error) {
            Alert.alert("Ошибка", 'Ошибка: \n' + error);
        } finally {
            stopLoading();
        }
    };


    const handleMonthChange = async (date) => {
        startLoading();
        console.log('Новый выбранный месяц:', date);
        const newYear = date.getFullYear();
        setYear(newYear);
        const newMonth = date.getMonth()+1;
        const currentMonth = month;
        const updatedMonth = currentMonth + (newMonth - currentMonth);
        setMonth(newMonth); 
            console.log(year, month);
            console.log(newYear, newMonth)
            try {
                await fetchData(newYear, newMonth);
            } catch (err) {
                Alert.alert("Ошибка", 'Ошибка: \n' + err);
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
                console.log(durationInMinute)
                if(durationInMinute>0){
                let hours = Math.floor(durationInMinute / 60); // Получаем количество целых часов
                let minutes = Math.floor(durationInMinute % 60);
                duration = `${hours}ч${minutes}мин`;
                }
                else duration = 'не установлено';
                setmiddleTime(duration);
                
                endTime = `${formattedEndTime}\nдлительность: ${duration}`;
            }
            
            let dayInfo = `${startTime}\n${endTime}`;
            Alert.alert(formattedDate, dayInfo);
        }
    }
    
    
    return (
        <View style={styles.container}>
           
                <View>
                    <CalendarPicker
                        previousTitle="Предыдущий"
                        nextTitle="Следующий"
                        startFromMonday
                        weekdays={["пн", "вт", "ср", "чт", "пт", "сб", "вс"]}
                        months={['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек']}
                        onMonthChange={handleMonthChange}
                        customDatesStyles={customDatesStyles}
                        onDateChange={onDateChange}
                    
                    />
                     {loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                   <View>
                        {Store.trafficData ?
                            
                        (<View>
                            <Text style={styles.text}>закрыто дней - {daysCount}</Text>
                            <Text style={styles.text}>времени на работе - {fullTime}</Text>
                            <Text style={styles.text}>среднее время - {middleTime}</Text>
                        </View>)
                        :
                        (
                            <View style={styles.containerCentrallity}>
                                <Text style={styles.internalTextRowView}>Записи о времени отсутствуют</Text>
                            </View>
                        )}                   
                    </View>
            )}
            </View>
        </View>
    );
}
