import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/ListItems/taskItem";
import AttorneysItem from "src/ListItems/attorneysItem";
import { getAllStaticData, getUserAttorney } from "src/requests/userData";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles'; // Assuming projColors are imported from styles.ts
import * as Icons from '../../assets';

const phoneDirectory = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [taskCount, setTaskCount] = useState(false);
    const [selectedList, setSelectedList] = useState('Tasks');
    const [filterIndex, setFilterIndex] = useState("0");
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef(null);

    const fetchData = useCallback(async () => {
        try {
            startLoading();
            await getAllStaticData(Store.tokenData, false, false, true, false);
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

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
             await getAllStaticData(Store.tokenData, false, false, true, false);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    }, [selectedList]);

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
                    <View style={localStyles.container}>
                        {taskCount ? (
                            <View style={{ flex: 1 }}>
                                {Store.colleaguesData.map(item => <TaskItem key={item.id} item={item} />)}
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

export default phoneDirectory;
