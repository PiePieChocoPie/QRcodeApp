import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles';
import { useNetworkStatusContext } from "src/hooks/networkStatus/networkStatusProvider";
import StoryItem from "src/ListItems/storyItem";

const Tasks = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const isConnected = useNetworkStatusContext();

    

    const fetchData = useCallback(async () => {
        try {
            startLoading();
            
        } catch (error) {
            console.error('Ошибка получения данных:', error);
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

    return (
            <View style={localStyles.container}>
                <ScrollView>
                    <View style={localStyles.container}>
                                {Store.attorneys.map(item => <StoryItem key={item.ufCrm10ProxyNumber} item={item} />)}
                            </View>
                </ScrollView>
            </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projColors.currentVerse.main,
    }
});

export default Tasks;
