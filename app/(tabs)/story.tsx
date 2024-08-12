import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/ListItems/taskItem";
import AttorneysItem from "src/ListItems/attorneysItem";
import { getAllStaticData, getUserAttorney } from "src/requests/userData";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles'; 
import * as Icons from '../../assets';
import { useNetworkStatusContext } from "src/hooks/networkStatus/networkStatusProvider";

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
                                {Store.attorneys.map(item => <AttorneysItem key={item.ufCrm10ProxyNumber} item={item} />)}
                            </View>
                </ScrollView>
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
