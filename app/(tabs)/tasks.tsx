import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/ListItems/taskItem";
import AttorneysItem from "src/ListItems/attorneysItem";
import { getAllStaticData, getUserAttorney, getUserItinerary } from "src/requests/userData";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles'; // Assuming projColors are imported from styles.ts
import * as Icons from '../../assets';
import ItineraryItems from "src/ListItems/itineraryItems";

const Tasks = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [taskCount, setTaskCount] = useState(false);
    const [selectedList, setSelectedList] = useState('Tasks');
    const [filterIndex, setFilterIndex] = useState("0");
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef(null);

    const data = useMemo(() => [
        { id: '0', status: 'все', colors: ['#83AD00', '#FFFFFF'] },  
        { id: '1', status: 'просрочены', colors: ['#83AD00', '#FFFFFF'] },  
        { id: '2', status: 'на сегодня', colors: ['#83AD00', '#FFFFFF'] },  
        { id: '3', status: 'на этой неделе', colors: ['#83AD00', '#FFFFFF'] },
        { id: '4', status: 'на следующей неделе', colors: ['#83AD00', '#FFFFFF'] },  
        { id: '5', status: 'без срока', colors: ['#83AD00', '#FFFFFF'] },  
        { id: '6', status: 'больше двух недель', colors: ['#83AD00', '#FFFFFF'] },  
    ], []);

    const fetchData = useCallback(async () => {
        try {
            startLoading();
            switch(selectedList){
                case "Tasks":
                    await getAllStaticData(Store.tokenData, false, false, true, false);
                case "Attorneys":
                    await getUserAttorney(false);
                case "Itinerary":
                    await getUserItinerary();

            }
            setTaskCount(Store.taskData && Store.taskData.length > 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            return () => {};
        }, [])
    );

    const filterTaskList = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
        const startOfNextWeek = new Date(today.setDate(endOfWeek.getDate() + 1));
        const endOfNextWeek = new Date(today.setDate(startOfNextWeek.getDate() + 6));

        switch (filterIndex) {
            case '1':
                return Store.taskData.filter(item => item.deadline && new Date(item.deadline) < new Date());
            case '2':
                return Store.taskData.filter(item => new Date(item.deadline).toDateString() === new Date().toDateString());
            case '3':
                return Store.taskData.filter(item => new Date(item.deadline) >= startOfWeek && new Date(item.deadline) <= endOfWeek);
            case '4':
                return Store.taskData.filter(item => new Date(item.deadline) >= startOfNextWeek && new Date(item.deadline) <= endOfNextWeek);
            case '5':
                return Store.taskData.filter(item => !item.deadline);
            case '6':
                return Store.taskData.filter(item => new Date(item.deadline) > endOfNextWeek);
            default:
                return Store.taskData;
        }
    }, [filterIndex, Store.taskData]);

    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        console.log('Selected List:', selectedList);  // Логируем выбранный список
        try {
            if (selectedList === 'Tasks') {
                await getAllStaticData(Store.tokenData, false, false, true, false);
                console.log('Loaded Tasks');
            } else if (selectedList === 'Attorney') {
                await getUserAttorney(false);
                console.log('Loaded Attorney');
            } else if (selectedList === 'Itinerary') {
                await getUserItinerary();
                console.log('Loaded Itinerary');
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
            stopLoading();
        }
    }, [selectedList]);

    const focusChange = (selectedData) => {
        startLoading();
        console.log('Changing selected list to:', selectedData);
        setSelectedList(selectedData);
        fetchData()
    };
   
    return (
            <View style={localStyles.container}>    
                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[projColors.currentVerse.accent]}
                    />}
                >
                    <View style={[localStyles.expanderContainer, { backgroundColor: "transparent" }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable onPress={() => focusChange('Tasks')} 
                            style={[localStyles.buttonContainer, { width: '35%', alignItems: "center", flex: 1 }, selectedList == 'Tasks' ? { backgroundColor: projColors.currentVerse.extra } : { backgroundColor: projColors.currentVerse.extrasecond }]}>
                                <Icons.tasks width={35} height={35} 
                                fill={selectedList == 'Tasks' ? projColors.currentVerse.extrasecond : projColors.currentVerse.extra} />
                                <Text 
                                style={[localStyles.buttonTitle, selectedList == 'Tasks' ? { color: projColors.currentVerse.extrasecond  } : { color: projColors.currentVerse.extra}]}>
                                    Задачи
                                </Text>
                            </Pressable>
                            <Pressable onPress={() => focusChange('Attorney')} 
                            style={[localStyles.buttonContainer, { width: '35%', alignItems: "center", flex: 1 }, selectedList == 'Attorney' ? { backgroundColor: projColors.currentVerse.extra } : { backgroundColor: projColors.currentVerse.extrasecond }]}>
                                <Icons.attorney width={35} height={35} 
                                   fill={selectedList == 'Attorney' ? projColors.currentVerse.extrasecond : projColors.currentVerse.extra} />
                                <Text style={[localStyles.buttonTitle, selectedList == 'Attorney' ? { color: projColors.currentVerse.extrasecond } : { color: projColors.currentVerse.extra }]}>Доверенность</Text>
                            </Pressable>
                            <Pressable onPress={() => focusChange('Itinerary')} 
                            style={[localStyles.buttonContainer, { width: '35%', alignItems: "center", flex: 1 }, selectedList == 'Itinerary' ? { backgroundColor: projColors.currentVerse.extra } : { backgroundColor: projColors.currentVerse.extrasecond }]}>
                                <Icons.route_list width={35} height={35} 
                                   fill={selectedList == 'Itinerary' ? projColors.currentVerse.extrasecond : projColors.currentVerse.extra} />
                                <Text style={[localStyles.buttonTitle, selectedList == 'Itinerary' ? { color: projColors.currentVerse.extrasecond } : { color: projColors.currentVerse.extra }]}>маршрутные листы</Text>
                            </Pressable>
                        </View>
                        {selectedList === "Tasks" && (
                            <FlatList
                            data={data}
                            keyExtractor={item => item.id}
                            horizontal
                            renderItem={({ item }) =>
                                <Pressable onPress={() => setFilterIndex(item.id)}>
                                    <View style={[
                                        localStyles.listElementContainer,
                                        { backgroundColor: filterIndex === item.id ? item.colors[0] : '#FFFFFF' }, // Установка цвета по умолчанию, белый
                                        { padding: 15, margin: 7 }
                                    ]}>
                                        <Text style={[
                                            localStyles.Title,
                                            { color: filterIndex === item.id ? item.colors[1] : '#000000' } // Установка цвета текста по умолчанию, черный
                                        ]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </Pressable>
                            }
                            showsHorizontalScrollIndicator={false}
                        />
                        )}
                    </View>
                    <View style={localStyles.container}>
                        {loading?(
                            <View style={localStyles.containerCentrallity}>
                            <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                            </View>
                        ):
                        taskCount ? (
                            <View style={{ flex: 1 }}>
                                {selectedList === 'Tasks' && filterTaskList.map(item => <TaskItem key={item.id} item={item} />)}
                                {selectedList === 'Attorney' && Store.attorneys.map(item => <AttorneysItem key={item.ufCrm10ProxyNumber} item={item} />)}
                                {selectedList === 'Itinerary' && Store.itineraries.map(item => <ItineraryItems key={item.id} item={item} />)}
                            </View>
                        ) : (
                            <Text style={localStyles.Text}>Задачи не установлены</Text>
                        )}
                    </View>
                </ScrollView>

                <Pressable
                    onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
                    style={({ pressed }) => [
                        localStyles.scrollToTopButton,
                        {
                            backgroundColor: pressed ? projColors.currentVerse.redroDark : projColors.currentVerse.redro,
                        },
                    ]}
                >
                    <Text style={localStyles.scrollToTopButtonText}>↑</Text>
                </Pressable>

            </View>
    );
};

const localStyles = StyleSheet.create({
    containerCentrallity: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main,
    },
    expanderContainer: {
        flex: 1,
        padding: 10,
    },
    buttonContainer: {
        backgroundColor: projColors.currentVerse.listElementBackground,
        borderRadius: 10,
        margin: 5,
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        fontSize: 16,
        color: projColors.currentVerse.font,
        marginTop: 10,
    },
    listElementContainer: {
        backgroundColor: projColors.currentVerse.listElementBackground,
        borderRadius: 5,
        margin: 5,
        padding: 15,
    },
    Title: {
        fontSize: 16,
        color: projColors.currentVerse.font,
    },
    Text: {
        fontSize: 16,
        color: projColors.currentVerse.fontAccent,
        textAlign: 'center',
        marginTop: 20,
    },
    scrollToTopButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: projColors.currentVerse.redro,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollToTopButtonText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
});

export default Tasks;
