import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/ListItems/taskItem";
import AttorneysItem from "src/ListItems/attorneysItem";
import { getAllStaticData, getUserAttorney, getUserItinerary } from "src/requests/userData";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles'; // Assuming projColors are imported from styles.ts
import * as Icons from 'assets/icons/taskPageIcons';
import ItineraryItems from "src/ListItems/itineraryItems";
import useFonts from "src/useFonts";
import TaskPageTabSelector from "src/components/taskPageTabsSelector";
import TaskPageTaskFilter from "src/components/taskPageTaskFilter";
import ToggleTaskRoleButton from "src/components/toggleTaskRoleButton";

const Tasks = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [taskCount, setTaskCount] = useState(false);
    const [filterIndex, setFilterIndex] = useState("0");
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef(null);
    const fontsLoaded = useFonts();
    const [activeTab, setActiveTab] = useState<'tasks' | 'attorney' | 'routes'>('tasks');
    const [activeFilter, setActiveFilter] = useState<'all' | 'overdue' | 'today' | 'thisWeek' | 'nextWeek' | 'withoutDeadline' | 'moreThanTwoWeek'>('all');

    const handleTabChange = (newTab: 'tasks' | 'attorney' | 'routes') => {
        setActiveTab(newTab);
      };

    const handleFilterChange = (newFilter: 'all' | 'overdue' | 'today' | 'thisWeek' | 'nextWeek' | 'withoutDeadline' | 'moreThanTwoWeek') => {
        setActiveFilter(newFilter);
      };
      
      const handleToggleChange = (states: { [key: string]: boolean }) => {
        console.log("Current states:", states); // Log current toggle states
      };

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
            switch(activeTab){
                case "tasks":
                    await getAllStaticData(Store.tokenData, false, false, true, false);
                case "attorney":
                    await getUserAttorney(false);
                case "routes":
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
        switch (activeFilter) {
            case 'overdue':
                return Store.taskData.filter(item => item.deadline && new Date(item.deadline) < new Date());
            case 'today':
                return Store.taskData.filter(item => new Date(item.deadline).toDateString() === new Date().toDateString());
            case 'thisWeek':
                return Store.taskData.filter(item => new Date(item.deadline) >= startOfWeek && new Date(item.deadline) <= endOfWeek);
            case 'nextWeek':
                return Store.taskData.filter(item => new Date(item.deadline) >= startOfNextWeek && new Date(item.deadline) <= endOfNextWeek);
            case 'withoutDeadline':
                return Store.taskData.filter(item => !item.deadline);
            case 'moreThanTwoWeek':
                return Store.taskData.filter(item => new Date(item.deadline) > endOfNextWeek);
            default:
                return Store.taskData;
        }
    }, [activeFilter, Store.taskData]);

    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        console.log('Selected List:', activeTab);  // Логируем выбранный список
        try {
            if (activeTab === 'tasks') {
                await getAllStaticData(Store.tokenData, false, false, true, false);
                console.log('Loaded Tasks');
            } else if (activeTab === 'attorney') {
                await getUserAttorney(false);
                console.log('Loaded Attorney');
            } else if (activeTab === 'routes') {
                await getUserItinerary();
                console.log('Loaded Itinerary');
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
            stopLoading();
        }
    }, [activeTab]);
   
    return (
            <View style={localStyles.container}>   
                            <TaskPageTabSelector activeTab={activeTab} onTabChange={handleTabChange} />
                            {activeTab === "tasks" && (
                            <>
                            <ToggleTaskRoleButton
                                buttons={["Исполнитель", "Наблюдатель", "Постановщик"]}
                                onChange={handleToggleChange}
                              />
                        <TaskPageTaskFilter activeFilter={activeFilter} onFilterChange={handleFilterChange}/>
                        </>
                        )}
                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[projColors.currentVerse.accent]}
                    />}
                >
                    <View style={localStyles.container}>
                        {loading&&fontsLoaded?(
                            <View style={localStyles.containerCentrallity}>
                            <ActivityIndicator size="large" color={projColors.currentVerse.fontAlter} />
                            </View>
                        ):
                        taskCount ? (
                            <View style={{ flex: 1 }}>
                                {activeTab === 'tasks' && filterTaskList.map(item => <TaskItem key={item.id} item={item} />)}
                                {activeTab === 'attorney' && Store.attorneys.map(item => <AttorneysItem key={item.ufCrm10ProxyNumber} item={item} />)}
                                {activeTab === 'routes' && Store.itineraries.map(item => <ItineraryItems key={item.id} item={item} />)}
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
                    <Icons.upArrow/>
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
        fontFamily: "boldFont"
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
        fontFamily: "boldFont"
    },
    Text: {
        fontSize: 16,
        color: projColors.currentVerse.fontAlter,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: "baseFont"
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
        fontFamily: "baseFont"
    },
});

export default Tasks;
