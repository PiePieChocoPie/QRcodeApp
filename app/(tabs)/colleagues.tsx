import React, { useState, useRef, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, StyleSheet, TextInput} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from "src/useLoading";
import Store from "src/stores/mobx";
import { projColors } from 'src/stores/styles'; // Assuming projColors are imported from styles.ts
import { getPhoneNumbersOfColleagues } from "src/requests/hierarchy";
import ColleaguesItem from "src/ListItems/colleaguesItem";
import { findAndModifyContact } from "src/contactsHandler";
import { usePopupContext } from "src/PopupContext";
import Button from 'src/components/button';

const phoneDirectory = () => {
    const { loading, startLoading, stopLoading } = useLoading();
    const [colleaguesExist, setColleaguesExist] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [availableOptions, setAvailableOptions] = useState([]);
    const [colleaguesList, setColleaguesList] = useState([]);
    const scrollViewRef = useRef(null);
    const [search, setSearch] = useState('');
    const { showPopup } = usePopupContext();

    
      

    const fetchData = useCallback(async () => {
        try {
            startLoading();
            checkAvailability();
            await getPhoneNumbersOfColleagues();
            if (Store.colleaguesData){
                setColleaguesExist(true);
                setColleaguesList(Store.colleaguesData);
        }
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
        setSearch(value); // Обновляем строку поиска
    
        if (!value || value.trim() === "") {
            // Если строка поиска пуста, возвращаем полный список
            setColleaguesList(Store.colleaguesData);
        } else {
            const searchTerms = value.toLowerCase().trim().split(/\s+/); // Разделяем строку поиска на слова
    
            // Фильтруем список коллег, проверяя каждое слово в каждом из полей
            setColleaguesList(Store.colleaguesData.filter(colleague => {
                return searchTerms.every(term => 
                    colleague.LAST_NAME?.toLowerCase().includes(term) ||
                    colleague.SECOND_NAME?.toLowerCase().includes(term) ||
                    colleague.NAME?.toLowerCase().includes(term) ||
                    colleague.UF_USR_EMPLOYEE_DEPARTMENT_1C?.toLowerCase().includes(term) ||
                    colleague.WORK_CITY?.toLowerCase().includes(term) ||
                    colleague.WORK_POSITION?.toLowerCase().includes(term) ||
                    colleague.UF_USR_EMPLOYEE_JOB_FUNCTION_1C?.toLowerCase().includes(term) ||
                    colleague.EMAIL?.toLowerCase().includes(term) ||
                    colleague.PERSONAL_MOBILE?.toLowerCase().includes(term)
                );
            }));
        }
    
        // Проверяем наличие результатов
        if (colleaguesList.length > 0) {
            setColleaguesExist(true);
        } else {
            setColleaguesExist(false);
        }
    
        console.log(colleaguesList[0]);
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
                {/* <Button handlePress={importHandle} title='Импорт контактов'/> */}
                </View>
                {loading ? (
            <View style={localStyles.containerCentrallity}>
                <ActivityIndicator size="large" color={projColors.currentVerse.fontAlter} />
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
                                {colleaguesList.map(item => <ColleaguesItem key={item.ID} item={item} availableOptions={availableOptions}/>)}
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
        color: projColors.currentVerse.fontAlter,
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
