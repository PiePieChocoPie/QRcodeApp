import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon3 from 'react-native-vector-icons/Feather';
import Store from "src/stores/mobx";
import { projColors } from "src/stores/styles";
import { getAllStaticData } from "src/http";
import { styles } from "src/stores/styles";
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";

export default function Tasks() {
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
    const elements = Store.taskData ? Store.taskData.map(item => {
        const [detailVisible, setDetailVisible] = React.useState(false);
        const [depDate, setDepDate] = React.useState('');
        const [depDLDate, setDepDLDate] = React.useState('');
        React.useEffect(() => {
            const onlyDate = item.createdDate.split('T')[0]
            setDepDate(onlyDate);
            const onlyDLDate = item.deadline ? item.deadline.split('T')[0] : "не установлен";
            setDepDLDate(onlyDLDate);
        }, [Store.taskData[0]]);
        const toggleMore = () => {
            setDetailVisible(!detailVisible);
        };
        return (
                <View key={item.id} style={styles.taskView}>
                    <Text style={{fontSize: 16, textAlign: "center"}}>{item.title}</Text>
                    <View style={styles.taskInternalView}>
                        <View style={styles.internalTextRowView}>
                            <Text>постановщик: </Text>
                            <Text style={{fontSize: 16}}>{item.creator.name}</Text>
                        </View>
                        <View style={styles.internalTextRowView}>
                            <Text>дата постановки: </Text>
                            <Text style={styles.text}>{depDate}</Text>
                        </View>
                        <View style={styles.internalTextRowView}>
                            <Text>дедлайн: </Text>
                            {item.deadline ? (
                                <Text style={styles.text}>{depDLDate}</Text>
                            ) : (
                                <Text style={styles.text}>не установлен</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.moreButton} onPress={toggleMore}>
                            <Icon3 name={'more-horizontal'} size={30}/>
                        </TouchableOpacity>
                    </View>
                    {detailVisible && (
                        <View>
                            {item.description ? (
                                <Text style={styles.descriptionText}>{item.description}</Text>
                            ) : (
                                <Text style={styles.descriptionText}>Дополнительная информация отсутствует</Text>
                            )}
                        </View>
                    )}
                </View>
        )
    }):(
        <Text style={styles.noValueText}>Задачи не установлены</Text>
    )

        return (
        <View style={styles.container}>
            
                <View style={styles.horizontalBorders}>
                        {taskCount?
                            (<ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[projColors.currentVerse.accent]}
                                    />
                                }>
                                {loading ? (
                                    <View style={styles.containerCentrallity}>
                                        <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
                                    </View>
                                ) : (
                                    elements
                                )}
                            </ScrollView>
                            )
                            :(
                                <Text style={styles.noValueText}>Задачи не установлены</Text>
                            )
                        }
                </View>
                <View style={styles.infoButtonContainer}>
                </View>
        </View>
    );
}
                
                 
