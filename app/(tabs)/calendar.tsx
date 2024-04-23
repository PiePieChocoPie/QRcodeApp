import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator, ScrollView, RefreshControl, Text } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { getUsersTrafficStatistics } from "src/http";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import СalendarItem from "src/ListItems/calendarItem";
import Store from "src/stores/mobx";


export default function Calendar() {
    const { loading, startLoading, stopLoading } = useLoading();
    const [markedDates, setMarkedDates] = useState({});
    const [customDatesStyles, setCustomDatesStyles] = useState([]);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    // Формируем массив объектов для customDatesStyles
    
    useFocusEffect(
        React.useCallback(() => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            setYear(currentYear)
            const currentMonth = currentDate.getMonth() + 1; // Добавляем 1, так как месяцы в JS начинаются с 0
            setMonth(currentMonth)
            fetchData();
        }, []) 
    );

    const fetchData = async () => {
        try {
            startLoading();           
            await getUsersTrafficStatistics(month, year)            
            .then((res)=>{    
                if(res){
                    console.log(Store.trafficData)
                    const customStyles = Store.trafficData.map(day => {
                        let dayStatus = 0;
                        const startTime = new Date(day.workday_date_start).getHours() * 60 + new Date(day.workday_date_start).getMinutes();
                        console.log('начало дня - ', startTime)
                        dayStatus = startTime < 9 * 60 + 15 ? 0 : 1;
                        if (day.workday_complete){
                            const endTime = new Date(day.workday_date_finish).getHours() * 60 + new Date(day.workday_date_finish).getMinutes();
                            console.log('конец дня - ',endTime)
                            dayStatus = endTime < 17 * 60 + 45 ? dayStatus+1 : dayStatus;
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
        const newMonth = date.getMonth() + 1;
        setMonth(newMonth);
        console.log(year,month);
        try {
            const res = await getUsersTrafficStatistics(year, month);
            if(!res) Alert.alert('ошибка','ошибка получения ')
        } catch (err) {
            Alert.alert("Ошибка", 'Ошибка: \n' + err);
        }
        stopLoading();
    };

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        // код обновления данных здесь
        console.log('обновляем календарь')
        fetchData();
        // Завершение обновления
        setRefreshing(false);
    }, []);

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
                        customDatesStyles={customDatesStyles} // Если вам нужно будет использовать стилизацию для определенных дат
                        // onDateChange={undefined}
                    />
                     {loading ? (
                <View style={styles.containerCentrallity}>
                    <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                </View>
            ) : (
                    <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[projColors.currentVerse.accent]}
                        />
                        }
                    >
                        {Store.trafficData ?
                            
                        (Store.trafficData.map(item => <СalendarItem key={item.index} item={item}/>))
                        :
                        (
                            <View style={styles.containerCentrallity}>
                                <Text style={styles.internalTextRowView}>Записи о времени отсутствуют</Text>
                            </View>
                        )
}
                    </ScrollView>
            )}
            </View>
        </View>
    );
}
