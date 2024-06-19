import React, { useState, useRef } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet, Dimensions, Animated } from 'react-native';
import Store from "src/stores/mobx";
import { projColors, styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/ListItems/taskItem";
import AttorneysItem from "src/ListItems/attorneysItem";
import * as Icons from '../../assets/navbar_icons';  // Импорт всех иконок из указанного пути
import { getAllStaticData, getUserAttorney } from "src/requests/userData";
import Svg, { Path } from 'react-native-svg';

const Tasks = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [taskCount, setTaskCount] = useState(false);
    const [selectedList, setSelectedList] = useState('Tasks');
    const [filterIndex, setFilterIndex] = useState("0");
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef(null);

    const data = [
        { id: '0', status: 'все', colors: [projColors.currentVerse.border, projColors.currentVerse.fontAccent] },
        { id: '1', status: 'просрочены', colors: ['#FF5752', '#FFFFFF'] },
        { id: '2', status: 'на сегодня', colors: ['#9DCF00', '#535D69'] },
        { id: '3', status: 'на этой неделе', colors: ['#2FC6F6', '#535D69'] },
        { id: '4', status: 'на следующей неделе', colors: ['#55D0E0', '#535D69'] },
        { id: '5', status: 'без срока', colors: ['#A8ADB4', '#535D69'] },
        { id: '6', status: 'больше двух недель', colors: ['#468EE5', '#FFFFFF'] },
    ];

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    startLoading();
                    await getAllStaticData(Store.tokenData, false, false, true, false);
                    setTaskCount(Store.taskData && Store.taskData.length > 0);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    stopLoading();
                }
            };

            fetchData();

            return () => { };
        }, [])
    );

    const filterTaskList = () => {
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
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        console.log('обновляем задачи');
        if (selectedList === 'Tasks') await getAllStaticData(Store.tokenData, false, false, true, false);
        else if (selectedList === 'Attorney') await getUserAttorney(false);
        setRefreshing(false);
    }, [selectedList]);

    const focusChange = async (selectedData) => {
        setSelectedList(selectedData);
        onRefresh();
    };

    return (
        loading ? (
            <View style={styles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
            </View>
        ) : (
            <View style={[styles.container, { marginTop: '10%' }]}>
                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[projColors.currentVerse.accent]}
                    />}
                >
                    <View style={[styles.expanderContainer, { backgroundColor: "transparent" }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => focusChange('Tasks')} style={[styles.listElementContainer, { width: '40%', alignItems: "center", flex: 1 }, selectedList == 'Tasks' ? { backgroundColor: projColors.currentVerse.extra } : { backgroundColor: projColors.currentVerse.extrasecond }]}>
                                <Svg width="17" height="20" viewBox="0 0 17 20" fill="none">
                                    <Path d="M7.45 16L13.1 10.35L11.65 8.9L7.425 13.125L5.325 11.025L3.9 12.45L7.45 16ZM2.5 20C1.95 20 1.47933 19.8043 1.088 19.413C0.696666 19.0217 0.500667 18.5507 0.5 18V2C0.5 1.45 0.696 0.979333 1.088 0.588C1.48 0.196667 1.95067 0.000666667 2.5 0H10.5L16.5 6V18C16.5 18.55 16.3043 19.021 15.913 19.413C15.5217 19.805 15.0507 20.0007 14.5 20H2.5ZM9.5 7H14.5L9.5 2V7Z" fill={selectedList === 'Tasks' ? projColors.currentVerse.extrasecond : projColors.currentVerse.extra} />
                                </Svg>
                                <Text style={[styles.Title, selectedList === 'Tasks' ? { color: projColors.currentVerse.extrasecond } : { color: projColors.currentVerse.extra }]}>Задачи</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => focusChange('Attorney')} style={[styles.listElementContainer, { width: '40%', alignItems: "center", flex: 1 }, selectedList == 'Attorney' ? { backgroundColor: projColors.currentVerse.extra } : { backgroundColor: projColors.currentVerse.extrasecond }]}>
                                <Svg width="22" height="23" viewBox="0 0 22 23">
                                    <Path d="M4.5 0H14.5V2H18.5V11H16.5V4H14.5V6H4.5V4H2.5V20H9.5V22H0.5V2H4.5V0ZM6.5 4H12.5V2H6.5V4ZM17.5 13V17H21.5V19H17.5V23H15.5V19H11.5V17H15.5V13H17.5Z" fill={selectedList === 'Attorney' ? projColors.currentVerse.extrasecond : projColors.currentVerse.extra} />
                                </Svg>
                                <Text style={[styles.Title, selectedList === 'Attorney' ? { color: projColors.currentVerse.extrasecond } : { color: projColors.currentVerse.extra }]}>Доверенность</Text>
                            </TouchableOpacity>
                        </View>
                        {selectedList === "Tasks" && (
                            <FlatList
                                data={data}
                                keyExtractor={item => item.id}
                                horizontal
                                renderItem={({ item }) =>
                                    <TouchableOpacity onPress={() => setFilterIndex(item.id)}>
                                        <View style={[styles.listElementContainer, { backgroundColor: item.colors[0], padding: 15, margin: 7 }]}>
                                            <Text style={[styles.Title, { color: item.colors[1] }]}>{item.status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                showsHorizontalScrollIndicator={false}
                            />
                        )}
                    </View>
                    <View style={styles.container}>
                        {taskCount ? (
                            <View style={{ flex: 1 }}>
                                {selectedList === 'Tasks' && filterTaskList().map(item => <TaskItem key={item.id} item={item} />)}
                                {selectedList === 'Attorney' && Store.attorneys.map(item => <AttorneysItem key={item.ufCrm10ProxyNumber} item={item} />)}
                            </View>
                        ) : (
                            <Text style={styles.Text}>Задачи не установлены</Text>
                        )}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
                    style={localStyles.scrollToTopButton}
                >
                    <Text style={localStyles.scrollToTopButtonText}>↑</Text>
                </TouchableOpacity>
            </View>
        )
    );
};

const localStyles = StyleSheet.create({
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
