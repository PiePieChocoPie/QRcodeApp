import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';
import { projColors } from "src/stores/styles"; // Импортируем цвета из projColors
import CustomModal from 'src/components/custom-modal'; // Импортируем пользовательское модальное окно
import Icon from 'react-native-vector-icons/FontAwesome6'; // Импортируем иконки

const ColleaguesItem = ({ item }) => {
    const [availableOptions, setAvailableOptions] = useState([]); // Храним доступные опции для звонков/сообщений
    const [modalVisible, setModalVisible] = useState(false); // Храним состояние видимости модального окна

    useEffect(() => {
        // Проверяем доступность приложений для звонков и сообщений
        const checkAvailability = async () => {
            const options = [{ label: 'Мобильный звонок', value: 'mobile', color: projColors.currentVerse.redro, url: `tel:${item.PERSONAL_MOBILE}` }];
            const messengers = [
                { label: 'Telegram', url: `tg://msg?text=&to=${item.PERSONAL_MOBILE}`, value: 'telegram', color: '#27a7e7' },
                { label: 'VK', url: `vk://vk.com/write${item.PERSONAL_MOBILE}`, value: 'vk', color: '#4d7198' },
                { label: 'WhatsApp', url: `whatsapp://send?phone=${item.PERSONAL_MOBILE}`, value: 'whatsapp', color: '#2cb742' },
                { label: 'Viber', url: `viber://contact?number=${item.PERSONAL_MOBILE}`, value: 'viber', color: '#8c60c3' },
                { label: 'Skype', url: `skype:${item.PERSONAL_MOBILE}?call`, value: 'skype', color: '#009EDC' },
            ];

            // Проверяем каждое приложение на доступность
            for (const messenger of messengers) {
                const supported = await Linking.canOpenURL(messenger.url);
                if (supported) {
                    options.push(messenger); // Добавляем в список опций, если приложение доступно
                }
            }

            setAvailableOptions(options); // Обновляем состояние с доступными опциями
        };

        checkAvailability(); // Вызываем функцию проверки доступности
    }, [item.PERSONAL_MOBILE]); // Эффект срабатывает при изменении номера телефона

    // Функция для открытия нужного приложения или вызова
    const call = (url) => {
        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err)); // Открываем URL или логируем ошибку
    };

    // Функция для отображения алерта с подтверждением вызова
    const showPhone = () => {
        Alert.alert('Позвонить по номеру:', item.PERSONAL_MOBILE, [
            { text: 'Отмена', style: 'cancel' }, // Кнопка отмены
            { text: 'Звонок', onPress: () => call(`tel:${item.PERSONAL_MOBILE}`), style: 'default' } // Кнопка вызова
        ]);
    };

    // Функция для переключения видимости модального окна
    const toggleMore = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <TouchableOpacity onPress={toggleMore} onLongPress={showPhone}>
            <View key={item.id} style={[styles.listElementContainer, item.IS_ONLINE === 'Y' && { backgroundColor: "#f7f9f7" }]}>
                <Text style={styles.Title}>{item.NAME} {item.LAST_NAME}</Text> {/* Отображаем имя и фамилию */}
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.Text}>{item.WORK_POSITION}</Text> {/* Отображаем должность */}
                    <Text style={styles.Text}>{item.PERSONAL_MOBILE}</Text> {/* Отображаем мобильный номер */}
                </View>
                <CustomModal
                    visible={modalVisible}
                    onClose={toggleMore}
                    title={`${item.NAME} ${item.LAST_NAME}`}
                    marginTOP={0.2}
                    content={
                        <View style={styles.containerCentrallityFromUpper}>
                            <Text style={styles.Title}>{item.NAME} {item.LAST_NAME}</Text> {/* Повторное отображение имени и фамилии */}
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.Text}>{item.WORK_POSITION}</Text> {/* Повторное отображение должности */}
                                <Text style={styles.Text}>{item.PERSONAL_MOBILE}</Text> {/* Повторное отображение мобильного номера */}
                            </View>
                            <View style={{ flex: 1 }}>
                                {/* Отображаем доступные опции для вызова или отправки сообщения */}
                                {availableOptions.map(option => (
                                    <TouchableOpacity
                                        onPress={() => call(option.url)}
                                        style={[styles.listElementContainer, { flexDirection: 'row' }]}
                                        key={option.value} // Используем уникальный ключ для каждого элемента
                                    >
                                        <Icon name={option.value} size={20} color={option.color} /> {/* Иконка приложения */}
                                        <Text style={styles.Title}>{option.label}</Text> {/* Название приложения */}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    }
                />
            </View>
        </TouchableOpacity>
    );
};

// Стили для компонентов
const styles = StyleSheet.create({
    listElementContainer: {
        backgroundColor: projColors.currentVerse.extrasecond,
        borderColor: projColors.currentVerse.border,
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        gap: 5,
        padding: 23,
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
    containerCentrallityFromUpper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ColleaguesItem; // Экспортируем компонент для использования в других частях приложения
