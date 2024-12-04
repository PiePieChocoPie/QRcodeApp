import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ActivityIndicator } from "react-native-paper";
import CustomModal from "src/components/custom-modal";
import { getUserById } from "src/requests/userData";
import { projColors } from "src/stores/styles"; 
import useLoading from "src/useLoading";
import * as Icons from '../../assets';
import { getUpdById } from "src/requests/docs";
import { formatDate } from "src/func/func";

const ItineraryItems = ({ item }) => {
    const [depDate, setDepDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [activeUpdIndex, setActiveUpdIndex] = useState(null); // Состояние для хранения индекса активного upd
    const [creator, setCreator] = useState(null);
    const [updates, setUpdates] = useState([]); // Отдельное состояние для объектов обновлений
    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const onlyDate = item.createdTime.split('T')[0];
        setDepDate(onlyDate);
    }, [item]);

    const toggleMore = async () => {
        setModalVisible(!modalVisible);
        startLoading();
        try {
            const creatorData = await getUserById(item.createdBy);

            // Загружаем все обновления по идентификаторам
            const updatedItems = await Promise.all(
                item.ufCrm6Upd.map(async (updId) => {
                    const updData = await getUpdById(updId);
                    return updData.result.items[0];
                })
            );

            setUpdates(updatedItems); // Обновляем состояние с загруженными объектами
            setCreator(creatorData[0]);
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            stopLoading();
        }
    };

    const openMaps = () => {
        if (item.ufCrm6RoutingRouteYandex) {
            Linking.openURL(item.ufCrm6RoutingRouteYandex);
        }
    };

    const call = () => {
        if (creator?.PERSONAL_MOBILE) {
            Linking.openURL(`tel:${creator.PERSONAL_MOBILE}`);
        }
    };

    const renderItem = (upd, index) => (
        <TouchableOpacity
            key={index}
            style={[styles.listElementContainer,{width:'70%'}]}
            onPress={() => setActiveUpdIndex(index)} // Устанавливаем индекс активного upd
        >
            <Text style={[styles.Text, { textAlign: "center" }]}>{upd?upd.ufCrm5ShortName:'УПД не найдено'}</Text>
            <CustomModal
                visible={activeUpdIndex === index} // Проверяем, открыт ли именно этот upd
                onClose={() => setActiveUpdIndex(null)} // Закрываем модальное окно
                title={upd?upd.title:'УПД не найдено'}
                marginTOP={0.2}
                content={
                    <View style={styles.containerCentrallityFromUpper}>
                        {upd&&upd.ufCrm5DriverTask&&<Text style={styles.Title}>Задание для водителя: {upd.ufCrm5DriverTask}</Text>}
                        {upd&&upd.ufCrm5DeliveryAddress && <Text style={styles.Title}>Адрес доставки: {upd.ufCrm5DeliveryAddress}</Text>}
                    </View>
                }
            />
        </TouchableOpacity>
    );

    return (
        <TouchableOpacity onPress={toggleMore}>
            <View key={item.id} style={styles.listElementContainer}>
                <Text style={styles.Title}>{item.title}</Text>
                <Text style={styles.Text}>Стоимость: {item.cost}</Text>
                <CustomModal
                    visible={modalVisible}
                    onClose={toggleMore}
                    title={item.title}
                    marginTOP={0.2}
                    content={
                        loading ? (
                            <View style={styles.containerCentrallityFromUpper}>
                                <ActivityIndicator size="large" color={projColors.currentVerse.fontAlter} />
                            </View>
                        ) : (
                            <View style={styles.containerCentrallityFromUpper}>
                                <ScrollView contentContainerStyle={styles.container}>
                                    <Text style={styles.Text}>Стоимость: {item.cost}</Text>
                                    {creator && <Text style={styles.Text}>Постановщик: {creator.NAME} {creator.LAST_NAME}</Text>}
                                    <Text style={styles.Text}>Точек: {item.ufCrm6Upd.length}</Text>
                                    <Text style={styles.Text}>Дата постановки: {depDate}</Text>

                                    {/* Рендерим только если данные обновлений загружены */}
                                    {updates.length > 0 &&
                                        updates.map((upd, index) => renderItem(upd, index))}

                                    
                                </ScrollView>
                                <View style={styles.crop}>
                                {creator && (
                                        <TouchableOpacity
                                            onPress={call}
                                            style={[styles.socialContainer, { backgroundColor: '#009900', width:'90%' }]}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icons.stat_phone height={30} width={40} color={projColors.currentVerse.border}/>
                                                <Text style={[styles.TitleSocialOnModal, { color: projColors.currentVerse.border }]}>Позвонить</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    {item.ufCrm6RoutingRouteYandex && (
                                        <TouchableOpacity
                                            onPress={openMaps}
                                            style={[styles.socialContainer, { backgroundColor: 'white' , width:'90%'}]}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icons.yandex height={30} width={40} />
                                                <Text style={[styles.TitleSocialOnModal, { color: projColors.currentVerse.fontAlter }]}>Открыть маршрут</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    </View>
                            </View>
                        )
                    }
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    crop:{
        backgroundColor:projColors.currentVerse.extrasecond,
        width:'100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: projColors.currentVerse.border,
        marginBottom:10
    },
    container: {
        flexGrow: 1, // Используем flexGrow для растяжения содержимого
        padding: 10,
        alignContent: "center",
        alignItems: "center"
    },
    listElementContainer: {
        backgroundColor: projColors.currentVerse.extrasecond,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        gap: 5,
        padding: 23,
    },
    socialContainer: {
        backgroundColor: projColors.currentVerse.redro,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        padding: 9,
        alignItems: 'baseline',
        width: '80%',
    },
    TitleSocialOnModal: {
        fontSize: 19,
        fontWeight: 'bold',
        color: projColors.currentVerse.extra,
        textAlign: 'center',
        width: '89%',
    },
    Title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: projColors.currentVerse.font,
    },
    Text: {
        fontSize: 16,
        color: projColors.currentVerse.font,
        marginVertical: 5,
    },
    link: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    containerCentrallityFromUpper: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
});

export default ItineraryItems;
