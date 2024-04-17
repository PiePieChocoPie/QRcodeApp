import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon3 from 'react-native-vector-icons/Feather';
import Store from "src/stores/mobx";
import { projColors } from "src/stores/styles";
import { getAllStaticData } from "src/http";
import { styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/taskItem";



const Tasks = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [taskCount, setTaskCount] = useState(false);

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

            return () => {};
        }, [])
    );

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        // код обновления данных здесь
        console.log('обновляем')
        await getAllStaticData(Store.tokenData, false, false, true, false);
        // Завершение обновления
        setRefreshing(false);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.horizontalBorders}>
                {taskCount ? (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[projColors.currentVerse.accent]}
                            />
                        }
                    >
                        {loading ? (
                            <View style={styles.containerCentrallity}>
                                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                            </View>
                        ) : (
                            Store.taskData.map(item => <TaskItem key={item.id} item={item} />)
                        )}
                    </ScrollView>
                ) : (
                    <Text style={styles.noValueText}>Задачи не установлены</Text>
                )}
            </View>
            <View style={styles.infoButtonContainer}></View>
        </View>
    );
};
export default Tasks;
