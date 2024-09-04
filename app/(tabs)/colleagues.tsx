import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, FlatList, StyleSheet, Linking, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import TaskItem from "src/ListItems/taskItem";
import AttorneysItem from "src/ListItems/attorneysItem";
import { getAllStaticData, getUserAttorney } from "src/requests/userData";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles'; // Assuming projColors are imported from styles.ts
import * as Icons from '../../assets';
import { getPhoneNumbersOfColleagues } from "src/requests/hierarchy";
import ColleaguesItem from "src/ListItems/colleaguesItem";
import * as Contacts from 'expo-contacts';
import { PermissionsAndroid } from 'react-native';
import { findAndModifyContact } from "src/contactsHandler";
import { usePopupContext } from "src/PopupContext";
import Button from 'src/components/button';

const phoneDirectory = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [colleaguesExist, setColleaguesExist] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [availableOptions, setAvailableOptions] = useState([]);
    const scrollViewRef = useRef(null);
    const [search, setSearch] = useState('');
    const { showPopup } = usePopupContext();

    
      

    const fetchData = useCallback(async (find?: string) => {
        try {
            startLoading();
            checkAvailability();
            await getPhoneNumbersOfColleagues(find && find);
            if (Store.colleaguesData) 
                setColleaguesExist(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            stopLoading();
        }
    }, []);
    
    const checkAvailability = async () => {
        const options = [
            { label: 'Мобильный звонок', value: 'mobile', color: projColors.currentVerse.redro, url: `tel:` },
            { label: 'Telegram', url: `tg://msg?text=&to=`, value: 'telegram', color: '#27a7e7' },
            { label: 'Viber', url: `viber://contact?number=`, value: 'viber', color: '#8c60c3' },
        ];
        setAvailableOptions(options);
    };
    

    useFocusEffect(

        useCallback(() => {
            fetchData();
            return () => {};
            
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            fetchData()
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);
    const searchHandler = (value) => {
        setSearch(value);
        fetchData(value)
    };

    const importHandle = async()=>{
        let failed = 0;
            let updated = 0;
            let added = 0;
            
            if (!search) {
                for (let colleague of Store.colleaguesData) {
                    const result = await findAndModifyContact(colleague);
                    switch (result) {
                        case '1':
                            added++;
                            break;
                        case '2':
                            updated++;
                            break;
                        default:
                            failed++;
                            break;
                    }
                }
                let message = '';
                if (added > 0) message += `Добавлено: ${added}\n`;
                if (updated > 0) message += `Обновлено: ${updated}\n`;
                if (failed > 0) message += `Не удалось: ${failed}\n`;
                
                showPopup(message, 'success');
            }
    }

    return (
       
            <View style={localStyles.container}>
                <View>
                <TextInput
                            style={localStyles.input}
                            value={search}
                            placeholder='Поиск'
                            onChangeText={searchHandler}
                        />
                <Button handlePress={importHandle} title='Импорт контактов'/>
                </View>
                {loading ? (
            <View style={localStyles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAccent} />
            </View>
        ) : (
            <>
                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[projColors.currentVerse.accent]}
                        />
                    }
                >
                    <View style={localStyles.container}>
                        {colleaguesExist ? (
                            <View style={{ flex: 1 }}>
                                {Store.colleaguesData.map(item => <ColleaguesItem key={item.ID} item={item} availableOptions={availableOptions}/>)}
                            </View>
                        ) : (
                            <Text style={localStyles.Text}>Коллеги не найдены</Text>
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
                </>
        )}
            </View>
        )
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
    input: {
        backgroundColor: "#f7f8f9",
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        width: '100%',
        margin:5,
        alignSelf:"center"
    },
});

export default phoneDirectory;
