import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import Icon3 from 'react-native-vector-icons/Feather';
import Store from "src/stores/mobx";
import { projColors } from "src/stores/styles";
import { getAllStaticData } from "src/http";
import { styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import { ActivityIndicator } from "react-native-paper";

export default function Tasks() {
    const { loading, startLoading, stopLoading } = useLoading();
    const [taskCount, setTaskCount] = useState(false);
    const [depDates, setDepDates] = useState([]);
    const [depDLDates, setDepDLDates] = useState([]);
    

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

    useEffect(() => {
        if (Store.taskData && Store.taskData.length > 0) {
            const dates = Store.taskData.map(item => {
                const onlyDate = item.createdDate.split('T')[0];
                const onlyDLDate = item.deadline ? item.deadline.split('T')[0] : "не установлен";
                return { depDate: onlyDate, depDLDate: onlyDLDate };
            });
            setDepDates(dates.map(date => date.depDate));
            setDepDLDates(dates.map(date => date.depDLDate));
        }
    }, [Store.taskData]);

    const onRefresh = React.useCallback(async () => {
        try {
            await getAllStaticData(Store.tokenData, false, false, true, false);
            setTaskCount(Store.taskData && Store.taskData.length > 0);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }, []);

    const [taskDescriptions, setTaskDescriptions] = useState([]);

    useEffect(() => {
        if (Store.taskData && Store.taskData.length > 0) {
            setTaskDescriptions(Array(Store.taskData.length).fill(false));
        }
    }, [Store.taskData]);

    const toggleMore = (index) => {
        setTaskDescriptions(prevTaskDescriptions => {
            const updatedTaskDescriptions = [...prevTaskDescriptions];
            updatedTaskDescriptions[index] = !updatedTaskDescriptions[index];
            return updatedTaskDescriptions;
        });
    };

    const elements = Store.taskData ? Store.taskData.map((item, index) => (
        <View key={item.id} style={styles.taskView}>
            <Text style={{fontSize: 16, textAlign: "center"}}>{item.title}</Text>
            <View style={styles.taskInternalView}>
                <View style={styles.internalTextRowView}>
                    <Text>постановщик: </Text>
                    <Text style={{fontSize: 16}}>{item.creator.name}</Text>
                </View>
                <View style={styles.internalTextRowView}>
                    <Text>дата постановки: </Text>
                    <Text style={styles.text}>{depDates[index]}</Text>
                </View>
                <View style={styles.internalTextRowView}>
                    <Text>дедлайн: </Text>
                    <Text style={styles.text}>{depDLDates[index]}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton} onPress={() => toggleMore(index)}>
                    <Icon3 name={'more-horizontal'} size={30}/>
                </TouchableOpacity>
            </View>
            {!depDates[index] && (
                <View>
                    {item.description ? (
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    ) : (
                        <Text style={styles.descriptionText}>Дополнительная информация отсутствует</Text>
                    )}
                </View>
            )}
        </View>
    )) : (
        <Text style={styles.noValueText}>Задачи не установлены</Text>
    );

    return (
        <View style={styles.containerCentrallity}>
            <View style={styles.containerCentrallity}>
                {loading ? (
                    <View style={styles.containerCentrallity}>
                        <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />                    
                    </View>
                ) : (
                    taskCount ? (
                        <ScrollView style={{flex:1}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={onRefresh}
                                    colors={[projColors.currentVerse.accent]}
                                />
                            }
                        >
                            {elements}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noValueText}>Задачи не установлены</Text>
                    )
                )}
            </View>
        </View>
    );
}
