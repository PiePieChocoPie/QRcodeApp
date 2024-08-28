import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/hooks/useLoading";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles';
import { useNetworkStatusContext } from "src/hooks/networkStatus/networkStatusProvider";
import StoryItem from "src/ListItems/storyItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'src/components/button';
import { usePopupContext } from "src/hooks/popup/PopupContext";
import { addToArray, findObjectById, getItemsWithoutTitle, removeItemFromArray, updateObjectInArray } from "src/stores/asyncStorage";
import { getDataAboutDocs, getNextStatus, updAttorneyStatus, updItineraryStatus, updUpdStatus } from "src/requests/docs";


const Story = () => {
    // Используем кастомный хук для отображения состояния загрузки
    const { loading, startLoading, stopLoading } = useLoading();
    const isConnected = useNetworkStatusContext();
    const { showPopup } = usePopupContext();

    // Функция для получения данных (например, документов)
    const fetchData = useCallback(async () => {
        try {
            startLoading();
            // Здесь выполняется получение данных
            Store.setDocsList(AsyncStorage.getItem('scanDocArray'))
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

    const docHandling = async() => {
        try{
            startLoading();
            if(isConnected){
                let array = await getItemsWithoutTitle(['scanDocArray']);
                let errorMessage = 'Не удалось отправить:\n';
                const arrayLength = array.length();
                let successUpdate = 0;
                array.forEach(async element => {
                    let id=JSON.stringify(element.id_time).split('_')[0]
                    let docData = await getDataAboutDocs(id);
                    updateObjectInArray('scanDocArray',id, docData);
                    if(docData.stageId=='DT168_9:UC_YAHBD0'){
                        if(!findObjectById('docToDelivery',docData))
                        addToArray('docToDelivery',findObjectById('scanDocArray', docData));
                        removeItemFromArray('scanDocArray',{ id_time: element.id_time, docData})
                    }
                    else{
                        let nextStatus = await getNextStatus(docData);
                        if(!nextStatus.error)
                        {
                            switch(element.typeId){
                                case '133':
                                    await updAttorneyStatus(docData.id, JSON.stringify(nextStatus), Store.userData.ID);
                                case '168':
                                    await updItineraryStatus(docData.id, JSON.stringify(nextStatus), Store.userData.ID);
                                case '166':
                                    await updUpdStatus(docData.id, JSON.stringify(nextStatus), Store.userData.ID);
                            }
                            successUpdate++;
                        }
                        else errorMessage+=`недостаточно прав на обработку документа - ${docData.title};`;
                    }
                });
                if(errorMessage=='Не удалось отправить:\n') errorMessage="Документы были отправлены успешно";
                Alert.alert('результат', errorMessage)
            }
            else{
                showPopup('Невозможно изменить статус документов\nПроверьте подключение к сети', 'warning');
            }
        }
        catch(e){
            showPopup('Ошибка отправки документа', 'error');
            console.log(e)
        }
        finally{
            stopLoading();
        }
    }

    return (
        <View style={localStyles.container}>
            <View style={{height:'20%'}}>
                <Button handlePress={docHandling} title={'QR код сотрудника'} />

            </View>
            <ScrollView>
                <View style={localStyles.container}>
                    {/* Отображение списка документов из хранилища Store */}
                    {Store.docsList.map(item => (
                        <StoryItem key={item.id_title} item={item} />
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
