import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/hooks/useLoading";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles';
import { useNetworkStatusContext } from "src/hooks/networkStatus/networkStatusProvider";
import StoryItem from "src/ListItems/storyItem";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Story = () => {
    // Используем кастомный хук для отображения состояния загрузки
    const { loading, startLoading, stopLoading } = useLoading();
    const isConnected = useNetworkStatusContext();

    // Функция для получения данных (например, документов)
    const fetchData = useCallback(async () => {
        try {
            startLoading();
            // Здесь выполняется получение данных
            Store.setDocsList(AsyncStorage.getItem('documents'))
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    // Хук, который запускает fetchData при фокусировке на экране
    useFocusEffect(
        useCallback(() => {
            fetchData();
            return () => {};
        }, [])
    );

    return (
        <View style={localStyles.container}>
            <ScrollView>
                <View style={localStyles.container}>
                    {/* Отображение списка документов из хранилища Store */}
                    {Store.docsList.map(item => (
                        <StoryItem key={item.ufCrm10ProxyNumber} item={item} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

// Стили для компонента Tasks
const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main,
    }
});

export default Story;
